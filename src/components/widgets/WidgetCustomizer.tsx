import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Palette, SlidersHorizontal, Shapes, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { CustomStyles } from "@/utils/widgetUtils";
import { Label } from "@/components/ui/label";

interface WidgetCustomizerProps {
    showCustomizer: boolean;
    setShowCustomizer: (show: boolean) => void;
    customStyles: CustomStyles;
    onStyleChange: (updates: Partial<CustomStyles>) => void;
    darkMode: boolean;
    readOnly?: boolean;
    variant?: "default" | "sidebar";
    // Optional props for controlling top-level settings if provided
    widgetSettings?: any;
    onSettingChange?: (updates: any) => void;
}

const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-zinc-200/60 rounded-xl overflow-hidden bg-white/40 mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/60 transition-colors group"
            >
                <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700 group-hover:text-zinc-900 uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600" />
                    {title}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-1 space-y-5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ColorInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder: string }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{label}</label>
            <span className="text-[10px] text-zinc-400 font-mono">{value || "Auto"}</span>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-zinc-300 transition-colors cursor-pointer group relative">
            <div
                className="w-full h-6 rounded-[4px] border border-zinc-100 relative overflow-hidden"
                style={{ backgroundColor: value || placeholder }}
            >
                <input
                    type="color"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    value={value || placeholder}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    </div>
);

export const WidgetCustomizer = ({
    showCustomizer,
    setShowCustomizer,
    customStyles,
    onStyleChange,
    darkMode,
    readOnly,
    variant = "default",
    widgetSettings,
    onSettingChange
}: WidgetCustomizerProps) => {
    if (readOnly) return null;

    if (variant === "sidebar") {
        return (
            <div className="space-y-1">
                {/* 1. General Settings */}
                <Section title="General" icon={SlidersHorizontal} defaultOpen={true}>
                    <div className="space-y-3">
                        {onSettingChange && (
                            <>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-zinc-700">Dark Mode</Label>
                                    <Switch
                                        checked={darkMode}
                                        onCheckedChange={(c) => onSettingChange({ dark_mode: c })}
                                        className="scale-90 data-[state=checked]:bg-[#14873e]"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-zinc-700">Video Priority</Label>
                                    <Switch
                                        checked={widgetSettings?.show_video_first || false}
                                        onCheckedChange={(c) => onSettingChange({ show_video_first: c })}
                                        className="scale-90 data-[state=checked]:bg-[#14873e]"
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-zinc-700">Filter Videos</Label>
                            <Switch
                                checked={customStyles.filterVideo ?? true}
                                onCheckedChange={(c) => onStyleChange({ filterVideo: c })}
                                className="scale-90 data-[state=checked]:bg-[#14873e]"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-zinc-700">Filter Text</Label>
                            <Switch
                                checked={customStyles.filterText ?? true}
                                onCheckedChange={(c) => onStyleChange({ filterText: c })}
                                className="scale-90 data-[state=checked]:bg-[#14873e]"
                            />
                        </div>
                    </div>
                </Section>

                {/* 2. Shape & Style */}
                <Section title="Card Style" icon={Shapes} defaultOpen={true}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">Border Radius</Label>
                            <div className="grid grid-cols-5 p-1 bg-zinc-100/80 rounded-lg">
                                {["0px", "0.5rem", "1rem", "1.5rem", "9999px"].map((r, i) => {
                                    const labels = ["Sq", "Sm", "Md", "Lg", "Full"];
                                    const isSelected = customStyles.borderRadius === r;
                                    return (
                                        <button
                                            key={r}
                                            onClick={() => onStyleChange({ borderRadius: r })}
                                            className={`
                                                text-[10px] font-semibold py-1.5 rounded-md transition-all
                                                ${isSelected ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}
                                            `}
                                        >
                                            {labels[i]}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onStyleChange({ showShadow: !customStyles.showShadow })}
                                className={`
                                    flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all
                                    ${customStyles.showShadow
                                        ? "bg-white border-[#14873e]/30 text-[#14873e] shadow-sm ring-1 ring-[#14873e]/20"
                                        : "bg-white/40 border-zinc-200 text-zinc-500 hover:bg-white hover:border-zinc-300"}
                                `}
                            >
                                {customStyles.showShadow && <Check className="w-3 h-3" />}
                                Shadow
                            </button>
                            <button
                                onClick={() => onStyleChange({ showBorder: !customStyles.showBorder })}
                                className={`
                                    flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all
                                    ${customStyles.showBorder
                                        ? "bg-white border-[#14873e]/30 text-[#14873e] shadow-sm ring-1 ring-[#14873e]/20"
                                        : "bg-white/40 border-zinc-200 text-zinc-500 hover:bg-white hover:border-zinc-300"}
                                `}
                            >
                                {customStyles.showBorder && <Check className="w-3 h-3" />}
                                Border
                            </button>
                        </div>
                    </div>
                </Section>

                {/* 3. Colors & Text */}
                <Section title="Colors & Text" icon={Palette}>
                    <div className="space-y-4">
                        {/* Containers */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Containers</label>
                            <div className="grid grid-cols-2 gap-3">
                                <ColorInput
                                    label="Widget Background"
                                    value={customStyles.backgroundColor}
                                    placeholder={darkMode ? "#000000" : "#ffffff"}
                                    onChange={(v) => onStyleChange({ backgroundColor: v })}
                                />
                                <ColorInput
                                    label="Card Background"
                                    value={customStyles.cardBackgroundColor || ""}
                                    placeholder={darkMode ? "#18181b" : "#ffffff"}
                                    onChange={(v) => onStyleChange({ cardBackgroundColor: v })}
                                />
                                <ColorInput
                                    label="Border Color"
                                    value={customStyles.borderColor}
                                    placeholder={darkMode ? "#27272a" : "#e4e4e7"}
                                    onChange={(v) => onStyleChange({ borderColor: v })}
                                />
                                <ColorInput
                                    label="Accent (Stars/Icon)"
                                    value={customStyles.primaryColor}
                                    placeholder="#3b82f6"
                                    onChange={(v) => onStyleChange({ primaryColor: v })}
                                />
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Typography</label>
                            <div className="grid grid-cols-2 gap-3">
                                <ColorInput
                                    label="Content Text"
                                    value={customStyles.contentColor || ""}
                                    placeholder={darkMode ? "#f4f4f5" : "#09090b"}
                                    onChange={(v) => onStyleChange({ contentColor: v })}
                                />
                                <ColorInput
                                    label="Author Name"
                                    value={customStyles.authorColor || ""}
                                    placeholder={darkMode ? "#ffffff" : "#000000"}
                                    onChange={(v) => onStyleChange({ authorColor: v })}
                                />
                                <ColorInput
                                    label="Author Role"
                                    value={customStyles.roleColor || ""}
                                    placeholder={darkMode ? "#a1a1aa" : "#71717a"}
                                    onChange={(v) => onStyleChange({ roleColor: v })}
                                />
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        );
    }

    // Fallback/Legacy
    return null;
};
