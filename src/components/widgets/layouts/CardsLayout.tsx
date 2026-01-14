import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface CardsLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const CardsLayout = ({
    displayItems,
    darkMode,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: CardsLayoutProps) => {
    const isMobile = previewDevice === "mobile";

    return (
        <div className={`
            w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent
            ${isMobile ? "max-h-[600px] px-4" : "max-h-[650px] px-6"}
        `}>
            {/* Grid Layout: 1 col mobile, 2 cols desktop */}
            <div className={`
                grid gap-6 pb-20 pt-4
                ${isMobile ? "grid-cols-1" : "grid-cols-2"}
            `}>
                {displayItems.map((t, i) => (
                    <motion.div
                        key={t.id || i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`
                            relative p-8 rounded-[2rem] border-2 flex flex-col h-full
                        `}
                        style={{
                            backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                            color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                            borderRadius: customStyles.borderRadius,
                        }}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <TestimonialAvatar testimonial={t} size="md" />
                            <div className={`p-2 rounded-full ${darkMode ? "bg-primary/10 text-primary" : "bg-primary/5 text-primary"}`}>
                                <Quote className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex-1 mb-6">
                            <TestimonialStars rating={t.rating} size="w-4 h-4" className="mb-3" />
                            <div className="text-base font-medium leading-relaxed">
                                <ExpandableContent
                                    content={t.content || ""}
                                    maxLength={150}
                                    darkMode={darkMode}
                                    isVideo={t.type === 'video'}
                                    videoUrl={t.video_url}
                                />
                            </div>
                        </div>

                        <div className={`pt-4 border-t border-dashed ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                            <p className="font-bold text-sm truncate">{t.author_name}</p>
                            <p className={`text-xs mt-0.5 truncate ${subtextClasses(darkMode)}`}>
                                {t.author_title || t.author_company || "Verified Customer"}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
