import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface MinimalLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
}

export const MinimalLayout = ({
    displayItems,
    darkMode,
    customStyles,
    previewDevice = "desktop"
}: MinimalLayoutProps) => {
    const isMobile = previewDevice === "mobile";

    return (
        <div className={`
            w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent
            ${isMobile ? "max-h-[600px] px-4" : "max-h-[650px] px-6"}
        `}>
            <div className="grid grid-cols-1 gap-6 pb-20 pt-4">
                {displayItems.map((t, i) => (
                    <motion.div
                        key={t.id || i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`
                            relative p-8 rounded-[2rem] border transition-all duration-300
                            ${darkMode
                                ? "bg-gray-900/50 hover:bg-gray-900 border-gray-800 hover:border-gray-700"
                                : "bg-white/50 hover:bg-white border-gray-100 hover:border-gray-200"
                            }
                        `}
                        style={{
                            backgroundColor: customStyles.backgroundColor ? undefined : (darkMode ? "rgba(17, 24, 39, 0.4)" : "rgba(255, 255, 255, 0.6)"),
                            // We allow custom background override if specifically set, otherwise use the nice semi-transparent minimal look
                            ...(customStyles.backgroundColor ? { backgroundColor: customStyles.backgroundColor } : {}),
                            borderColor: customStyles.borderColor,
                            borderRadius: customStyles.borderRadius,
                            color: customStyles.textColor,
                        }}
                    >
                        <div className="flex gap-4 items-start">
                            <TestimonialAvatar testimonial={t} size="md" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className={`font-bold text-sm ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                                            {t.author_name}
                                        </h4>
                                        <p className={`text-xs ${subtextClasses(darkMode)}`}>
                                            {t.author_title || t.author_company}
                                        </p>
                                    </div>
                                    <TestimonialStars rating={t.rating} size="w-3.5 h-3.5" />
                                </div>

                                <div className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    <ExpandableContent content={t.content || ""} maxLength={180} darkMode={darkMode} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
