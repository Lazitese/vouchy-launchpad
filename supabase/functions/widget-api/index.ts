import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        const pathParts = url.pathname.split('/')
        const workspaceId = pathParts[pathParts.length - 2]
        const endpoint = pathParts[pathParts.length - 1]

        if (!workspaceId) {
            return new Response(
                JSON.stringify({ error: 'Missing workspace ID' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        if (endpoint === 'settings') {
            // Fetch widget settings
            const { data: settings, error } = await supabaseClient
                .from('widget_settings')
                .select('*')
                .eq('workspace_id', workspaceId)
                .single()

            if (error) {
                console.error('Error fetching widget settings:', error)
                return new Response(
                    JSON.stringify({ error: 'Failed to fetch widget settings' }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify(settings || { dark_mode: false, layout: 'grid', show_video_first: true }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        } else if (endpoint === 'testimonials') {
            // Fetch approved testimonials for this workspace
            const { data: testimonials, error } = await supabaseClient
                .from('testimonials')
                .select(`
          *,
          space:spaces!inner(workspace_id)
        `)
                .eq('space.workspace_id', workspaceId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) {
                console.error('Error fetching testimonials:', error)
                return new Response(
                    JSON.stringify({ error: 'Failed to fetch testimonials' }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify(testimonials || []),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        } else {
            return new Response(
                JSON.stringify({ error: 'Invalid endpoint' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }
    } catch (error) {
        console.error('Widget API Error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
