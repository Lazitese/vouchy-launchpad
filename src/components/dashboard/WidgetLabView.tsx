import { useState, useEffect, useRef } from "react";
import {
    Monitor, Tablet, Smartphone, Sparkles, Code2, Copy,
    Layout, Palette, Check, Moon, Video, Settings2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { WidgetPreview } from "@/components/WidgetPreview";
import { WidgetCustomizer } from "@/components/widgets/WidgetCustomizer";
import { useToast } from "@/hooks/use-toast";
import { Testimonial } from "@/hooks/useTestimonials";
import { WidgetSettings } from "@/hooks/useWorkspace";
import { widgetStyles, CustomStyles, defaultStyles } from "@/utils/widgetUtils";

interface WidgetLabViewProps {
    widgetSettings: WidgetSettings | null;
    updateWidgetSettings: (updates: Partial<WidgetSettings>) => Promise<any>;
    testimonials: Testimonial[];
    embedCode: string;
}

export const WidgetLabView = ({
    widgetSettings,
    updateWidgetSettings,
    testimonials,
    embedCode,
}: WidgetLabViewProps) => {
    const { toast } = useToast();
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

    // Fallback to defaultStyles to ensure type safety
    const [localCustomStyles, setLocalCustomStyles] = useState<CustomStyles>(
        (widgetSettings?.appearance as CustomStyles) || defaultStyles
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (widgetSettings?.appearance) {
            setLocalCustomStyles(widgetSettings.appearance as CustomStyles);
        }
    }, [widgetSettings?.appearance]);

    // Scaling Logic: Ensures the "True" desktop/mobile size fits in the preview area
    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return;

            // "True" Device Frame Dimensions (Outer Size including Bezels)
            const targets = {
                mobile: { w: 400, h: 840 },
                tablet: { w: 840, h: 1100 },
                desktop: { w: 1280, h: 840 }
            };

            const target = targets[previewDevice];

            // Add margin for the stage (so it doesn't touch edges)
            const stagePadding = 48;

            const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

            const availW = containerW - stagePadding;
            const availH = containerH - stagePadding;

            // Compute scaling factors
            const scaleX = availW / target.w;
            const scaleY = availH / target.h;

            // Fit Contain: Use the smaller scale to ensure full visibility
            // Cap at 1.0 to render "Native Size" if plenty of space
            let fitScale = Math.min(scaleX, scaleY);
            if (fitScale > 1) fitScale = 1;

            setScale(fitScale);
        };

        calculateScale();
        window.addEventListener("resize", calculateScale);
        return () => window.removeEventListener("resize", calculateScale);
    }, [previewDevice]);

    const handleCustomStyleChange = (updates: Partial<CustomStyles>) => {
        const newStyles = { ...localCustomStyles, ...updates } as CustomStyles;
        setLocalCustomStyles(newStyles);
        updateWidgetSettings({ appearance: newStyles });
    };

    const copyEmbed = async () => {
        if (!embedCode) {
            toast({ title: "Error", description: "No embed code available to copy.", variant: "destructive" });
            return;
        }

        const copyToClipboardFallback = (text: string) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // Ensure valid style so it doesn't affect layout but is "visible" for selection
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    toast({ title: "Copied to clipboard", description: "Snippet ready to paste." });
                } else {
                    throw new Error("Fallback copy failed.");
                }
            } catch (err) {
                console.error("Fallback copy error:", err);
                toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
            }

            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(embedCode);
                toast({ title: "Copied to clipboard", description: "Snippet ready to paste." });
            } catch (err) {
                console.warn("navigator.clipboard.writeText failed, trying fallback", err);
                copyToClipboardFallback(embedCode);
            }
        } else {
            console.warn("navigator.clipboard undefined, using fallback");
            copyToClipboardFallback(embedCode);
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-background border rounded-3xl shadow-sm overflow-hidden divide-x divide-border">

            {/* COLUMN 1: Layout & Appearance (Left, Single Column) */}
            <aside className="w-[340px] flex flex-col bg-card/50 backdrop-blur-sm shrink-0 h-full">
                {/* Header */}
                <div className="p-5 border-b shrink-0 flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Widget Lab
                    </h2>
                </div>

                {/* Scrollable Controls */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="p-5 space-y-8">

                        {/* SECTION 1: Layouts */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Layout className="w-3.5 h-3.5" />
                                Layout Style
                            </div>
                            <div className="space-y-2">
                                {widgetStyles.map((style) => {
                                    const isActive = widgetSettings?.layout === style.id;
                                    return (
                                        <button
                                            key={style.id}
                                            onClick={() => updateWidgetSettings({ layout: style.id as any })}
                                            className={`
                                                w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 group
                                                ${isActive
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md translate-x-1"
                                                    : "bg-background border-border hover:bg-muted/50"}
                                            `}
                                        >
                                            <div className={`
                                                p-2 rounded-lg shrink-0 transition-colors
                                                ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}
                                            `}>
                                                <Settings2 className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold">{style.name}</div>
                                                <div className={`text-[10px] truncate ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                                    {style.description}
                                                </div>
                                            </div>
                                            {isActive && <Check className="w-4 h-4" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* SECTION 2: Appearance */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Palette className="w-3.5 h-3.5" />
                                Customization
                            </div>

                            {/* Toggles */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-background border">
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <Moon className="w-3.5 h-3.5" /> Dark Mode
                                    </div>
                                    <Switch
                                        checked={widgetSettings?.dark_mode || false}
                                        onCheckedChange={(val) => updateWidgetSettings({ dark_mode: val })}
                                        className="scale-90"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-background border">
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <Video className="w-3.5 h-3.5 text-blue-500" /> Video Priority
                                    </div>
                                    <Switch
                                        checked={widgetSettings?.show_video_first || false}
                                        onCheckedChange={(val) => updateWidgetSettings({ show_video_first: val })}
                                        className="scale-90"
                                    />
                                </div>
                            </div>

                            {/* Inline Visual Customizer */}
                            <div className="bg-background border rounded-xl p-4">
                                <WidgetCustomizer
                                    showCustomizer={true}
                                    setShowCustomizer={() => { }}
                                    customStyles={localCustomStyles || defaultStyles}
                                    onStyleChange={handleCustomStyleChange}
                                    darkMode={widgetSettings?.dark_mode || false}
                                    variant="sidebar"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Embed */}
                <div className="p-4 border-t bg-muted/20 space-y-3 shrink-0">
                    <div className="flex justify-between items-center text-xs">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-red-500"
                            onClick={() => updateWidgetSettings({ appearance: {}, dark_mode: false, show_video_first: false })}
                        >
                            Reset Defaults
                        </Button>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="w-full gap-2 shadow-lg h-9"
                            >
                                <Code2 className="w-4 h-4" />
                                Get Embed Code
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Embed Widget</DialogTitle>
                                <DialogDescription>
                                    Copy and paste this code into your website's HTML body.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <pre className="p-4 rounded-lg bg-muted text-xs font-mono break-all whitespace-pre-wrap max-h-[300px] overflow-y-auto select-all">
                                        {embedCode}
                                    </pre>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" onClick={copyEmbed} className="gap-2">
                                    <Copy className="w-4 h-4" />
                                    Copy Code
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </aside>

            {/* COLUMN 2: Preview Stage (Broad Right) */}
            <main className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#020617] min-w-0 overflow-hidden">

                {/* Device Toolbar (Static Header) */}
                <div className="h-16 border-b flex items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 border border-border/40 p-1 rounded-full shadow-sm">
                        {(["desktop", "tablet", "mobile"] as const).map((device) => (
                            <button
                                key={device}
                                onClick={() => setPreviewDevice(device)}
                                className={`
                                    p-2.5 rounded-full transition-all duration-200
                                    ${previewDevice === device
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                                `}
                                title={`${device} Preview`}
                            >
                                {device === "desktop" && <Monitor className="w-4 h-4" />}
                                {device === "tablet" && <Tablet className="w-4 h-4" />}
                                {device === "mobile" && <Smartphone className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Canvas */}
                <div ref={containerRef} className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">

                    {/* Scaled Wrapper */}
                    <div
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'center center',

                            // Dimensions match the Mockup Outer Sizes
                            width: previewDevice === "mobile" ? 400 : previewDevice === "tablet" ? 840 : 1280,
                            height: previewDevice === "mobile" ? 840 : previewDevice === "tablet" ? 1100 : 840,

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="transition-transform duration-300 ease-out will-change-transform shadow-2xl rounded-lg bg-white dark:bg-slate-950"
                    >
                        <WidgetPreview
                            testimonials={testimonials}
                            darkMode={widgetSettings?.dark_mode || false}
                            layout={(widgetSettings?.layout as any) || "grid"}
                            showVideoFirst={widgetSettings?.show_video_first || false}
                            customStyles={localCustomStyles || defaultStyles}
                            previewDevice={previewDevice}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};