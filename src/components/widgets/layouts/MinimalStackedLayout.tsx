import { motion } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Quote } from "lucide-react";

interface MinimalStackedLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const MinimalStackedLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: MinimalStackedLayoutProps) => {
    const isMobile = previewDevice === "mobile";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981'; // emerald-500 as default

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="max-w-3xl mx-auto space-y-4 pb-20 pt-4 px-6">
                {displayItems.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.08,
                            duration: 0.4,
                            ease: "easeOut"
                        }}
                        whileHover={{
                            scale: 1.01,
                            transition: { duration: 0.2 }
                        }}
                        className={`relative p-6 rounded-2xl ${customStyles.showBorder ? "border-2" : "border"} ${customStyles.showShadow ? "shadow-lg" : "shadow-sm"} group`}
                        style={{
                            backgroundColor: cardBg,
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                        }}
                    >
                        {/* Quote icon */}
                        <div
                            className="absolute top-4 right-4 p-2 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                            style={{ backgroundColor: `${primary}30` }}
                        >
                            <Quote className="w-4 h-4" style={{ color: primary }} />
                        </div>

                        {/* Content */}
                        <div className="mb-4 pr-12" style={{ color: mainText }}>
                            <ExpandableContent
                                content={testimonial.content || ""}
                                maxLength={200}
                                darkMode={darkMode}
                                isVideo={false}
                                textColor={mainText}
                            />
                        </div>

                        {/* Footer with author and rating */}
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-dashed" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {testimonial.avatar_url ? (
                                    <img
                                        src={testimonial.avatar_url}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 shrink-0"
                                        style={{ '--tw-ring-color': `${primary}30` } as React.CSSProperties}
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                                        style={{
                                            backgroundColor: `${primary}20`,
                                            color: primary
                                        }}
                                    >
                                        {testimonial.name[0]}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm truncate" style={{ color: authorText }}>
                                        {testimonial.name}
                                    </p>
                                    <p className={`text-xs truncate ${subtextClasses(darkMode)}`} style={{ color: roleText }}>
                                        {testimonial.company || "Verified Customer"}
                                    </p>
                                </div>
                            </div>

                            <TestimonialStars
                                rating={testimonial.rating}
                                darkMode={darkMode}
                                size="w-4 h-4"
                                color={primary}
                                className="shrink-0"
                            />
                        </div>

                        {/* Subtle left border accent */}
                        <div
                            className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-50"
                            style={{ backgroundColor: primary }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MinimalStackedLayout;
