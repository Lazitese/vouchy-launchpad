
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { WidgetPreview } from "@/components/WidgetPreview";
import { CustomStyles } from "@/utils/widgetUtils";
import { Loader2 } from "lucide-react";

/**
 * EmbedWidget Page
 * 
 * This page is designed to be embedded via iframe on external websites.
 * It fetches the public testimonials and widget settings for a specific workspace.
 * It renders the WidgetPreview component in read-only mode, applying the customized designs.
 */

const EmbedWidget = () => {
    const { workspaceId } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadWidget = async () => {
            try {
                if (!workspaceId) return;

                // Use the Edge Function to fetch public data securely (or simulating public API)
                // This ensures we reuse the same logic as the legacy widget.js data fetching
                // But we can also invoke it via Supabase Client

                const { data: responseData, error: responseError } = await supabase.functions.invoke('widget-api', {
                    body: { method: 'GET_PUBLIC_DATA', workspaceId } // Custom method handling if needed, or default GET
                });

                // The widget-api function likely expects a specific RESTful pattern if invoked via fetch,
                // but invocation via 'functions.invoke' sends a POST by default with body.
                // We might need to stick to the standard fetch used in widget.js if the function isn't set up for RPC-style usage.

                // Let's rely on the direct fetch like widget.js did, to match existing backend.
                // We need the absolute URL of the Edge Function.
                const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
                const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/widget-api`;

                const [settingsRes, testimonialsRes] = await Promise.all([
                    fetch(`${FUNCTION_URL}/api/widget/${workspaceId}/settings`),
                    fetch(`${FUNCTION_URL}/api/widget/${workspaceId}/testimonials`)
                ]);

                if (!settingsRes.ok || !testimonialsRes.ok) {
                    throw new Error("Failed to load widget data");
                }

                const settings = await settingsRes.json();
                const testimonials = await testimonialsRes.json();

                // Settings might contain 'appearance' JSONB now (if updated backend returns it)
                // If not, we might need to fetch it via Supabase client directly if the Edge Function filters it out.
                // Since I added the column but didn't update the Edge Function, the Edge Function might NOT return 'appearance'
                // unless it does "select *".
                // Use direct Supabase client fetch for settings to be safe and ensure 'appearance' is present.

                const { data: settingsDirect, error: directError } = await supabase
                    .from("widget_settings")
                    .select("*")
                    .eq("workspace_id", workspaceId)
                    .single();

                if (directError) {
                    console.warn("Could not fetch direct settings", directError);
                    // Fallback to edge function result
                }

                const finalSettings = settingsDirect || settings;

                setData({ settings: finalSettings, testimonials });

            } catch (err) {
                console.error(err);
                setError("Failed to load widget data");
            } finally {
                setLoading(false);
            }
        };

        loadWidget();
    }, [workspaceId]);

    const [height, setHeight] = useState(0);

    // Automatic Resizing for Iframe
    useEffect(() => {
        const sendHeight = () => {
            const root = document.getElementById("vouchy-embed-root");
            if (root) {
                const newHeight = root.offsetHeight; // Total height including padding
                // Send message to parent (widget.js)
                window.parent.postMessage({ type: 'vouchy-resize', height: newHeight }, '*');
            }
        };

        // Send initial height
        sendHeight();

        // Observe changes
        const observer = new ResizeObserver(() => {
            sendHeight();
        });

        const root = document.getElementById("vouchy-embed-root");
        if (root) observer.observe(root);

        return () => observer.disconnect();
    }, [data]); // Re-run when data loads

    if (loading) return <div className="flex items-center justify-center h-full min-h-[200px] bg-transparent"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (error) return <div className="text-red-500 text-center p-8 bg-white/90 h-screen">{error}</div>;
    if (!data) return null;

    const { settings, testimonials } = data;

    // Ensure appearance is cast correctly
    const appearance = settings.appearance as Partial<CustomStyles> | undefined;

    return (
        <div className="h-auto w-full bg-transparent p-1 overflow-hidden" id="vouchy-embed-root">
            {/* Inject global styles for font if needed, though index.css handles it */}
            <WidgetPreview
                testimonials={testimonials}
                darkMode={settings.dark_mode}
                layout={settings.layout}
                showVideoFirst={settings.show_video_first}
                initialCustomStyles={appearance}
                readOnly={true}
            />
        </div>
    );
};

export default EmbedWidget;
