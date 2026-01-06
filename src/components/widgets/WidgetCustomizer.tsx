import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomStyles } from "@/utils/widgetUtils";

interface WidgetCustomizerProps {
    showCustomizer: boolean;
    setShowCustomizer: (show: boolean) => void;
    customStyles: CustomStyles;
    onStyleChange: (updates: Partial<CustomStyles>) => void;
    darkMode: boolean;
    readOnly?: boolean;
    variant?: "default" | "sidebar";
}

export const WidgetCustomizer = ({
    showCustomizer,
    setShowCustomizer,
    customStyles,
    onStyleChange,
    darkMode,
    readOnly,
    variant = "default"
}: WidgetCustomizerProps) => {
    if (readOnly) return null;

    if (variant === "sidebar") {
        return (
            <div className="space-y-6 text-sm">
                <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Colors</label>
                    <div className="space-y-3">
                        {/* Background */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs">Background</span>
                                <span className="text-[10px] text-muted-foreground opacity-70">{customStyles.backgroundColor || "Auto"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="color" className="w-full h-8 rounded cursor-pointer border-none p-0"
                                    value={customStyles.backgroundColor || (darkMode ? "#030712" : "#ffffff")}
                                    onChange={(e) => onStyleChange({ backgroundColor: e.target.value })} />
                            </div>
                        </div>
                        {/* Text and Primary Row */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-xs block mb-1">Text</span>
                                <input type="color" className="w-full h-8 rounded cursor-pointer border-none p-0"
                                    value={customStyles.textColor || (darkMode ? "#ffffff" : "#000000")}
                                    onChange={(e) => onStyleChange({ textColor: e.target.value })} />
                            </div>
                            <div>
                                <span className="text-xs block mb-1">Primary</span>
                                <input type="color" className="w-full h-8 rounded cursor-pointer border-none p-0"
                                    value={customStyles.primaryColor || "#3b82f6"}
                                    onChange={(e) => onStyleChange({ primaryColor: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shape</label>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs">Radius</span>
                            <select
                                value={customStyles.borderRadius}
                                onChange={(e) => onStyleChange({ borderRadius: e.target.value })}
                                className="text-xs bg-muted border-none rounded px-2 py-1 focus:ring-1 focus:ring-primary"
                            >
                                <option value="0px">Square</option>
                                <option value="0.5rem">Small</option>
                                <option value="1rem">Medium</option>
                                <option value="1.5rem">Large</option>
                                <option value="9999px">Round</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                                <input type="checkbox" checked={customStyles.showShadow}
                                    onChange={(e) => onStyleChange({ showShadow: e.target.checked })}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-xs">Card Shadow</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                                <input type="checkbox" checked={customStyles.showBorder}
                                    onChange={(e) => onStyleChange({ showBorder: e.target.checked })}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-xs">Card Border</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-t border-border/[0.08] pt-4">
            <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors mb-4"
            >
                {showCustomizer ? <ChevronLeft className="w-4 h-4 -rotate-90" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
                Customize Design
            </button>

            <AnimatePresence>
                {showCustomizer && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-6 text-sm border border-border/50">
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-subtext uppercase">Colors</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-xs block mb-1">Background</span>
                                        <div className="flex items-center gap-2">
                                            <input type="color" className="w-6 h-6 rounded cursor-pointer"
                                                value={customStyles.backgroundColor || (darkMode ? "#030712" : "#ffffff")}
                                                onChange={(e) => onStyleChange({ backgroundColor: e.target.value })} />
                                            <span className="text-xs opacity-50">{customStyles.backgroundColor || "Default"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs block mb-1">Text</span>
                                        <div className="flex items-center gap-2">
                                            <input type="color" className="w-6 h-6 rounded cursor-pointer"
                                                value={customStyles.textColor || (darkMode ? "#ffffff" : "#000000")}
                                                onChange={(e) => onStyleChange({ textColor: e.target.value })} />
                                            <span className="text-xs opacity-50">{customStyles.textColor || "Default"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs block mb-1">Primary</span>
                                        <div className="flex items-center gap-2">
                                            <input type="color" className="w-6 h-6 rounded cursor-pointer"
                                                value={customStyles.primaryColor || "#3b82f6"} // default primary
                                                onChange={(e) => onStyleChange({ primaryColor: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs block mb-1">Border</span>
                                        <div className="flex items-center gap-2">
                                            <input type="color" className="w-6 h-6 rounded cursor-pointer"
                                                value={customStyles.borderColor || (darkMode ? "#1f2937" : "#e5e7eb")}
                                                onChange={(e) => onStyleChange({ borderColor: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-subtext uppercase">Appearance</label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">Border Radius</span>
                                        <select
                                            value={customStyles.borderRadius}
                                            onChange={(e) => onStyleChange({ borderRadius: e.target.value })}
                                            className="text-xs bg-background border rounded px-2 py-1"
                                        >
                                            <option value="0px">Square</option>
                                            <option value="0.5rem">Small</option>
                                            <option value="1rem">Medium</option>
                                            <option value="1.5rem">Large</option>
                                            <option value="9999px">Round</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={customStyles.showShadow}
                                            onChange={(e) => onStyleChange({ showShadow: e.target.checked })} />
                                        <span className="text-xs">Show Shadow</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={customStyles.showBorder}
                                            onChange={(e) => onStyleChange({ showBorder: e.target.checked })} />
                                        <span className="text-xs">Show Border</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-subtext uppercase">Actions</label>
                                <button
                                    onClick={() => onStyleChange({
                                        primaryColor: "", backgroundColor: "", textColor: "", borderColor: "",
                                        borderRadius: "1rem", showShadow: true, showBorder: true
                                    })}
                                    className="text-xs text-red-500 hover:text-red-600 underline"
                                >
                                    Reset to Defaults
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
