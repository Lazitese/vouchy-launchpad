import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.658.0";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.658.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

        // Verify auth token
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Missing authorization header' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 401
                }
            );
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Verify the user's token
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired token' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 401
                }
            );
        }

        const { folder, contentType, fileExt } = await req.json();

        // Validate required fields
        if (!folder || !contentType) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: folder, contentType' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            );
        }

        // Validate folder type
        const allowedFolders = ['logos', 'avatars', 'profiles'];
        if (!allowedFolders.includes(folder)) {
            return new Response(
                JSON.stringify({ error: 'Invalid folder type' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            );
        }

        // Generate unique file path
        const timestamp = Date.now();
        const randomId = crypto.randomUUID().split('-')[0];
        const extension = fileExt || 'png';
        const filePath = `${folder}/${user.id}/${timestamp}-${randomId}.${extension}`;

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
        console.error('R2 upload error:', error);
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
