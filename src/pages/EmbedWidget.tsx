
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
                if (!workspaceId) {
                    console.error("Widget Error: Missing workspaceId parameter");
                    setError("No workspace ID provided");
                    return;
                }

                console.log(`Loading widget for workspace: ${workspaceId}`);

                // Parallel Fetching: Settings + Testimonials
                // We prioritize direct Supabase Client access because RLS policies are set to Public.
                // This avoids CORS issues often associated with raw fetch calls to Edge Functions from iframes.

                const settingsPromise = supabase
                    .from("widget_settings")
                    .select("workspace_id, layout, dark_mode, show_video_first, appearance")
                    .eq("workspace_id", workspaceId)
                    .single();

                const testimonialsPromise = supabase
                    .from("testimonials")
                    .select("id, space_id, type, content, video_url, author_name, author_title, author_company, author_avatar_url, rating, status, created_at, ai_summary, golden_quote, space:spaces!inner(workspace_id)")
                    .eq("space.workspace_id", workspaceId)
                    .eq("status", "approved")
                    .order("created_at", { ascending: false })
                    .limit(50);

                const [settingsResult, testimonialsResult] = await Promise.all([
                    settingsPromise,
                    testimonialsPromise
                ]);

                if (settingsResult.error) {
                    console.error("Error fetching settings:", settingsResult.error);
                    // Use defaults if settings fail, don't crash entirely? 
                    // But if it's a 406/Not Found, maybe the workspace doesn't exist.
                }

                if (testimonialsResult.error) {
                    console.error("Error fetching testimonials:", testimonialsResult.error);
                }

                const settings = (settingsResult.data || {}) as any;
                const testimonials = testimonialsResult.data || [];

                // Fallback / Defaults logic
                const finalSettings = {
                    ...settings,
                    appearance: settings.appearance || {}, // Ensure appearance object exists
                    layout: settings.layout || "grid",
                    dark_mode: settings.dark_mode ?? false,
                    show_video_first: settings.show_video_first ?? true,
                };

                console.log("Widget Data Loaded:", { settings: finalSettings, count: testimonials.length });

                setData({ settings: finalSettings, testimonials });

            } catch (err) {
                console.error("CRITICAL WIDGET ERROR:", err);
                setError("Failed to load widget data. Check console for details.");
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
