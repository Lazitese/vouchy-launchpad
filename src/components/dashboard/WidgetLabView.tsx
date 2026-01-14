import { useState, useEffect, useRef } from "react";
import {
    Monitor, Tablet, Smartphone, Sparkles, Code2, Copy,
    Layout, Palette, Check, Moon, Video, Settings2, Filter, FileText
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
import { Space } from "@/hooks/useSpaces";

interface WidgetLabViewProps {
    widgetSettings: WidgetSettings | null;
    updateWidgetSettings: (updates: Partial<WidgetSettings>) => Promise<any>;
    testimonials: Testimonial[];
    embedCode: string;
    spaces: Space[];
}

export const WidgetLabView = ({
    widgetSettings,
    updateWidgetSettings,
    testimonials,
    embedCode,
    spaces,
}: WidgetLabViewProps) => {
    const { toast } = useToast();
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
    const [activeMobileTab, setActiveMobileTab] = useState<"editor" | "preview">("editor");

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
                mobile: { w: 400, h: 900 },
                tablet: { w: 840, h: 1100 },
                desktop: { w: 1280, h: 900 }
            };

            const target = targets[previewDevice];

            // Reduce padding to zero to allow "bigger" fit
            const stagePadding = 10;

            const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

            const availW = containerW - stagePadding;
            const availH = containerH - stagePadding;

            // Compute scaling factors
            const scaleX = availW / target.w;
            const scaleY = availH / target.h;

            // Remove the cap at 1.0 to allow the preview to grow "bigger and bigger" on large screens
            let fitScale = Math.min(scaleX, scaleY);

            setScale(fitScale);
        };

        // Add a small delay to ensure the container is fully rendered
        const timer = setTimeout(() => {
            calculateScale();
        }, 100);

        calculateScale();
        window.addEventListener("resize", calculateScale);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", calculateScale);
        };
    }, [previewDevice, activeMobileTab]);

    const handleCustomStyleChange = (updates: Partial<CustomStyles>) => {
        const newStyles = { ...localCustomStyles, ...updates } as CustomStyles;
        setLocalCustomStyles(newStyles);
        updateWidgetSettings({ appearance: newStyles });
    };

    const toggleSpaceSelection = (spaceId: string) => {
        setSelectedSpaceIds(prev =>
            prev.includes(spaceId)
                ? prev.filter(id => id !== spaceId)
                : [...prev, spaceId]
        );
    };

    const toggleAllSpaces = () => {
        if (selectedSpaceIds.length === spaces.length) {
            setSelectedSpaceIds([]);
        } else {
            setSelectedSpaceIds(spaces.map(s => s.id));
        }
    };

    // Filter testimonials based on selected spaces
    // Filter testimonials based on selected spaces AND type filters
    const filteredTestimonials = testimonials.filter(t => {
        const inSpace = selectedSpaceIds.length === 0 || selectedSpaceIds.includes(t.space_id);

        const showVideo = localCustomStyles.filterVideo ?? true;
        const showText = localCustomStyles.filterText ?? true;

        const matchesType = (t.type === 'video' && showVideo) || (t.type === 'text' && showText);

        return inSpace && matchesType;
    });

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
        <div className="flex flex-col md:flex-row h-[calc(100dvh-180px)] md:h-[calc(100vh-6rem)] bg-background border rounded-3xl shadow-sm overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border">

            {/* Mobile Tab Toggle */}
            <div className="md:hidden flex p-2 bg-gray-50/50 border-b gap-2 shrink-0 z-20">
                <button
                    onClick={() => setActiveMobileTab("editor")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeMobileTab === "editor" ? "bg-black text-white shadow-lg" : "text-gray-400 bg-white/50"}`}
                >
                    <Settings2 className="w-3.5 h-3.5" />
                    Editor
                </button>
                <button
                    onClick={() => setActiveMobileTab("preview")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeMobileTab === "preview" ? "bg-black text-white shadow-lg" : "text-gray-400 bg-white/50"}`}
                >
                    <Monitor className="w-3.5 h-3.5" />
                    Live View
                </button>
            </div>

            {/* COLUMN 1: Layout & Appearance (Left, Single Column) */}
            <aside className={`
                w-full md:w-[340px] flex-col bg-card/50 backdrop-blur-sm shrink-0 overflow-hidden
                ${activeMobileTab === "editor" ? "flex flex-1" : "hidden md:flex md:h-full"}
            `}>
                {/* Header - Hidden on Mobile */}
                <div className="hidden md:flex p-5 border-b shrink-0 items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Widget Lab
                    </h2>
                </div>

                {/* Scrollable Controls */}
                <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="p-5 space-y-8">

                        {/* SECTION 0: Space Filter */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Filter className="w-3.5 h-3.5" />
                                    Space Filter
                                </div>
                                <button
                                    onClick={toggleAllSpaces}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                                >
                                    {selectedSpaceIds.length === spaces.length ? "Clear All" : "Select All"}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {spaces.length === 0 ? (
                                    <div className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
                                        No spaces available
                                    </div>
                                ) : (
                                    spaces.map((space) => {
                                        const isSelected = selectedSpaceIds.includes(space.id);
                                        const testimonialCount = testimonials.filter(t => t.space_id === space.id).length;

                                        return (
                                            <button
                                                key={space.id}
                                                onClick={() => toggleSpaceSelection(space.id)}
                                                className={`
                                                    w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200
                                                    ${isSelected
                                                        ? "bg-blue-50 border-blue-200 shadow-sm"
                                                        : "bg-white border-gray-200 hover:bg-gray-50"}
                                                `}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`
                                                        w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                                                        ${isSelected
                                                            ? "bg-blue-600 border-blue-600"
                                                            : "border-gray-300"}
                                                    `}>
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-black truncate">{space.name}</div>
                                                        <div className="text-[10px] text-gray-400">
                                                            {testimonialCount} {testimonialCount === 1 ? 'testimonial' : 'testimonials'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                            {selectedSpaceIds.length > 0 && (
                                <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg text-center">
                                    Showing {filteredTestimonials.length} testimonials from {selectedSpaceIds.length} {selectedSpaceIds.length === 1 ? 'space' : 'spaces'}
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* SECTION 1: Layouts */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
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
                                                    ? "bg-black text-white border-black shadow-md translate-x-1"
                                                    : "bg-white border-gray-200 hover:bg-gray-50"}
                                            `}
                                        >
                                            <div className={`
                                                p-2 rounded-lg shrink-0 transition-colors
                                                ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}
                                            `}>
                                                <Settings2 className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold">{style.name}</div>
                                                <div className={`text-[10px] truncate ${isActive ? "text-white/80" : "text-gray-400"}`}>
                                                    {style.description}
                                                </div>
                                            </div>
                                            {isActive && <Check className="w-4 h-4" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* SECTION 2: Appearance */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <Palette className="w-3.5 h-3.5" />
                                Customization
                            </div>

                            {/* Toggles */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                                    <div className="flex items-center gap-2 text-xs font-medium text-black">
                                        <Moon className="w-3.5 h-3.5" /> Dark Mode
                                    </div>
                                    <Switch
                                        checked={widgetSettings?.dark_mode || false}
                                        onCheckedChange={(val) => updateWidgetSettings({ dark_mode: val })}
                                        className="scale-90"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                                    <div className="flex items-center gap-2 text-xs font-medium text-black">
                                        <Video className="w-3.5 h-3.5 text-blue-500" /> Video Priority
                                    </div>
                                    <Switch
                                        checked={widgetSettings?.show_video_first || false}
                                        onCheckedChange={(val) => updateWidgetSettings({ show_video_first: val })}
                                        className="scale-90"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                                    <div className="flex items-center gap-2 text-xs font-medium text-black">
                                        <Video className="w-3.5 h-3.5 text-blue-500" /> Show Video
                                    </div>
                                    <Switch
                                        checked={localCustomStyles.filterVideo ?? true}
                                        onCheckedChange={(val) => handleCustomStyleChange({ filterVideo: val })}
                                        className="scale-90"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                                    <div className="flex items-center gap-2 text-xs font-medium text-black">
                                        <FileText className="w-3.5 h-3.5 text-gray-500" /> Show Text
                                    </div>
                                    <Switch
                                        checked={localCustomStyles.filterText ?? true}
                                        onCheckedChange={(val) => handleCustomStyleChange({ filterText: val })}
                                        className="scale-90"
                                    />
                                </div>
                            </div>

                            {/* Inline Visual Customizer */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
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
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3 shrink-0">
                    <div className="flex justify-between items-center text-xs">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-gray-400 hover:text-red-500"
                            onClick={() => updateWidgetSettings({ appearance: {}, dark_mode: false, show_video_first: false })}
                        >
                            Reset Defaults
                        </Button>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="w-full gap-2 shadow-lg h-9 bg-black text-white hover:bg-gray-800"
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
                                    <pre className="p-4 rounded-lg bg-gray-100 text-xs font-mono break-all whitespace-pre-wrap max-h-[300px] overflow-y-auto select-all border border-gray-200 text-black">
                                        {embedCode}
                                    </pre>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" onClick={copyEmbed} className="gap-2 bg-black text-white hover:bg-gray-800">
                                    <Copy className="w-4 h-4" />
                                    Copy Code
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </aside>

            {/* COLUMN 2: Preview Stage (Broad Right) */}
            <main className={`
                flex-1 flex flex-col bg-[#F0F2F5] min-w-0 overflow-hidden min-h-0
                ${activeMobileTab === "preview" ? "flex h-full" : "hidden md:flex md:h-full"}
            `}>

                {/* Device Toolbar (Static Header) */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-center bg-white/80 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-full shadow-sm">
                        {(["desktop", "tablet", "mobile"] as const).map((device) => (
                            <button
                                key={device}
                                onClick={() => setPreviewDevice(device)}
                                className={`
                                    p-2.5 rounded-full transition-all duration-200
                                    ${previewDevice === device
                                        ? "bg-black text-white shadow-sm"
                                        : "text-gray-400 hover:text-black hover:bg-gray-100"}
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
                            height: previewDevice === "mobile" ? 900 : previewDevice === "tablet" ? 1100 : 900,

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="transition-transform duration-300 ease-out will-change-transform shadow-2xl rounded-lg bg-white dark:bg-slate-950"
                    >
                        <WidgetPreview
                            testimonials={filteredTestimonials}
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