import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for',
};

// In-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 10; // max requests per window
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return false;
    }

    record.count++;
    return true;
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Rate limiting by IP
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        if (!checkRateLimit(ip)) {
            console.warn(`Rate limit exceeded for IP: ${ip}`);
            return new Response(
                JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 429
                }
            );
        }

        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Supabase credentials not configured');
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { bucket, spaceId, kind, contentType, fileExt } = await req.json();

        // Validate required fields
        if (!bucket || !spaceId || !kind || !contentType) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: bucket, spaceId, kind, contentType' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            );
        }

        // Space-based validation: Check if space exists and is active
        const { data: space, error: spaceError } = await supabaseAdmin
            .from('spaces')
            .select('id, is_active')
            .eq('id', spaceId)
            .single();

        if (spaceError || !space) {
            console.error('Space not found:', spaceId, spaceError);
            return new Response(
                JSON.stringify({ error: 'Invalid space ID' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404
                }
            );
        }

        if (!space.is_active) {
            console.error('Space is not active:', spaceId);
            return new Response(
                JSON.stringify({ error: 'Space is not active' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 403
                }
            );
        }

        // Generate unique file path
        const timestamp = Date.now();
        const randomId = crypto.randomUUID().split('-')[0];
        const extension = fileExt || (kind === 'video' ? 'webm' : 'png');
        const filePath = `${spaceId}/${kind}/${timestamp}-${randomId}.${extension}`;

        console.log('Generating signed URL for:', filePath);

        // Create signed upload URL (valid for 5 minutes)
        const { data: signedData, error: signedError } = await supabaseAdmin
            .storage
            .from(bucket)
            .createSignedUploadUrl(filePath);

        if (signedError) {
            console.error('Error creating signed URL:', signedError);
            throw signedError;
        }

        // Get public URL
        const { data: publicData } = supabaseAdmin
            .storage
            .from(bucket)
            .getPublicUrl(filePath);

        return new Response(
            JSON.stringify({
                signedUrl: signedData.signedUrl,
                publicUrl: publicData.publicUrl,
                path: filePath
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );
    } catch (error) {
        console.error('Signed upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        );
    }
});
