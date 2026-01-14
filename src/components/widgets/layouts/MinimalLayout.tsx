import { motion } from "framer-motion";
import { Quote, Play } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface MinimalLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const MinimalLayout = ({
    displayItems,
    darkMode,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
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
                        `}
                        style={{
                            backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                            borderRadius: customStyles.borderRadius,
                            color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
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
                                    {t.type === 'video' ? (
                                        <div
                                            className="flex items-center gap-3 cursor-pointer group/play mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onVideoClick?.(t.video_url || "");
                                            }}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover/play:scale-110 ${darkMode ? "bg-white text-black shadow-lg shadow-white/20" : "bg-black text-white shadow-lg shadow-black/20"}`}>
                                                <Play size={20} className="fill-current ml-0.5" />
                                            </div>
                                            <span className={`text-sm font-medium opacity-80 group-hover/play:opacity-100 ${darkMode ? "text-white" : "text-black"}`}>Watch Video</span>
                                        </div>
                                    ) : (
                                        <ExpandableContent content={t.content || ""} maxLength={180} darkMode={darkMode} isVideo={false} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
