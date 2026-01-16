import { motion } from "framer-motion";
import { Calendar, Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface TimelineLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const TimelineLayout = ({
    displayItems,
    darkMode,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: TimelineLayoutProps) => {
    const isMobile = previewDevice === "mobile";

    return (
        <div className={`w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent ${isMobile ? "px-4" : "px-6"}`}>
            <div className="relative max-w-6xl mx-auto py-12">
                {/* Timeline Line - Vertical */}
                <div className={`absolute ${isMobile ? "left-[20px]" : "left-1/2 -translate-x-1/2"} top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20`} />

                {/* Timeline Items */}
                <div className="space-y-12">
                    {displayItems.map((t, i) => {
                        const isLeft = i % 2 === 0;
                        const isVideo = t.type === 'video';

                        return (
                            <motion.div
                                key={t.id || i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={`relative flex items-center ${isMobile ? "flex-row" : isLeft ? "flex-row" : "flex-row-reverse"} gap-8`}
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute ${isMobile ? "left-[11px]" : "left-1/2 -translate-x-1/2"} z-10`}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                                        className="relative"
                                    >
                                        {/* Outer Pulse Ring */}
                                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "2s" }} />

                                        {/* Main Dot */}
                                        <div className="relative w-5 h-5 rounded-full bg-primary shadow-lg shadow-primary/50 border-4 border-white dark:border-zinc-900 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Spacer for Mobile */}
                                {isMobile && <div className="w-12 shrink-0" />}

                                {/* Card Container */}
                                <div className={`flex-1 ${isMobile ? "" : isLeft ? "pr-12" : "pl-12"}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className={`
                                            relative p-6 rounded-2xl
                                            ${customStyles.showBorder ? "border-2" : "border border-transparent"}
                                            ${customStyles.showShadow ? "shadow-xl" : "shadow-none"}
                                            backdrop-blur-sm
                                        `}
                                        style={{
                                            backgroundColor: customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                                            color: customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                                            borderRadius: customStyles.borderRadius,
                                        }}
                                    >
                                        {/* Decorative Quote */}
                                        <div className="absolute top-4 right-4 opacity-5">
                                            <Quote size={48} fill="currentColor" />
                                        </div>

                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <TestimonialAvatar testimonial={t} size="md" />

                                            {/* Date Badge (Mock) */}
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <TestimonialStars darkMode={darkMode} rating={t.rating} size="w-4 h-4" className="mb-3" color={customStyles.primaryColor} />

                                        {/* Content */}
                                        <div
                                            className="mb-4 text-sm leading-relaxed"
                                            style={{ color: customStyles.contentColor || customStyles.textColor || (darkMode ? "#ffffff" : "#000000") }}
                                        >
                                            <ExpandableContent
                                                content={t.content || ""}
                                                maxLength={180}
                                                darkMode={darkMode}
                                                isVideo={isVideo}
                                                videoUrl={t.video_url}
                                                textColor={customStyles.contentColor || customStyles.textColor || (darkMode ? "#ffffff" : "#000000")}
                                            />
                                        </div>

                                        {/* Footer */}
                                        <div className={`pt-4 border-t ${darkMode ? "border-zinc-700" : "border-zinc-200"}`}>
                                            <p
                                                className="font-bold text-sm"
                                                style={{ color: customStyles.authorColor || customStyles.textColor || (darkMode ? "#ffffff" : "#000000") }}
                                            >
                                                {t.author_name}
                                            </p>
                                            <p
                                                className={`text-xs mt-0.5 ${subtextClasses(darkMode)}`}
                                                style={{ color: customStyles.roleColor || (darkMode ? "#9ca3af" : "#6b7280") }}
                                            >
                                                {t.author_title || t.author_company || "Verified Customer"}
                                            </p>
                                        </div>

                                        {/* Connector Line to Timeline (Desktop Only) */}
                                        {!isMobile && (
                                            <div
                                                className={`absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r ${isLeft
                                                    ? "right-0 translate-x-full from-primary/40 to-transparent"
                                                    : "left-0 -translate-x-full from-transparent to-primary/40"
                                                    }`}
                                            />
                                        )}
                                    </motion.div>
                                </div>

                                {/* Empty Spacer for Desktop Alternating Layout */}
                                {!isMobile && <div className="flex-1" />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
