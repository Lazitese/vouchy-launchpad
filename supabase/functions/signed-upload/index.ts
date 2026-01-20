// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.658.0";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.658.0";

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

// Initialize R2 client
function getR2Client() {
    const R2_ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID');
    const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID');
    const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY');

    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        throw new Error('R2 credentials not configured');
    }

    return new S3Client({
        region: 'auto',
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    });
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
        const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME') || 'vouchy';
        const R2_PUBLIC_URL = Deno.env.get('R2_PUBLIC_URL');

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Supabase credentials not configured');
        }

        if (!R2_PUBLIC_URL) {
            throw new Error('R2_PUBLIC_URL not configured');
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { bucket, spaceId, kind, contentType, fileExt } = await req.json();

        // Validate required fields
        if (!spaceId || !kind || !contentType) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: spaceId, kind, contentType' }),
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
        const filePath = `testimonials/${spaceId}/${kind}/${timestamp}-${randomId}.${extension}`;

        console.log('Generating R2 signed URL for:', filePath);

        // Create R2 client and generate presigned URL
        const r2Client = getR2Client();

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filePath,
            ContentType: contentType,
        });

        // Generate presigned URL valid for 5 minutes
        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

        // Construct public URL
        const publicUrl = `${R2_PUBLIC_URL}/${filePath}`;

        return new Response(
            JSON.stringify({
                signedUrl: signedUrl,
                publicUrl: publicUrl,
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
