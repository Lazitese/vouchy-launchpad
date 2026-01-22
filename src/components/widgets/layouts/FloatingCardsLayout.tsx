import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Play, X, ChevronDown } from "lucide-react";

interface FloatingCardsLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const FloatingCardsLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: FloatingCardsLayoutProps) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const isMobile = previewDevice === "mobile";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981'; // emerald-500 as default

    const visibleTestimonials = showAll ? displayItems : displayItems.slice(0, 6);

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className={`grid gap-6 pb-20 pt-4 px-6 ${previewDevice === "mobile" ? "grid-cols-1" : previewDevice === "tablet" ? "grid-cols-2" : "grid-cols-3"}`}>
                {visibleTestimonials.map((testimonial, index) => {
                    const isVideo = testimonial.type === "video";

                    return (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 40, rotateX: 10 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{
                                delay: index * 0.1,
                                duration: 0.6,
                                ease: [0.21, 0.47, 0.32, 0.98],
                            }}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                                transition: { duration: 0.3 },
                            }}
                            className={`relative overflow-hidden rounded-[2rem] ${customStyles.showBorder ? "border-2" : "border"} ${customStyles.showShadow ? "shadow-xl" : "shadow-md"}`}
                            style={{
                                backgroundColor: cardBg,
                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* Floating shadow */}
                            <div
                                className="absolute -bottom-4 left-4 right-4 h-8 rounded-2xl bg-black/5 blur-xl -z-10"
                                style={{ transform: "translateZ(-20px)" }}
                            />

                            {/* Gradient accent - using brand color */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                style={{
                                    background: `linear-gradient(to right, transparent, ${primary}, transparent)`
                                }}
                            />

                            {isVideo ? (
                                <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                    <AnimatePresence>
                                        {playingId === testimonial.id ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0"
                                            >
                                                <iframe
                                                    src={`${testimonial.video_url}?autoplay=1`}
                                                    className="w-full h-full"
                                                    allow="autoplay"
                                                    allowFullScreen
                                                />
                                                <button
                                                    onClick={() => setPlayingId(null)}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                                                onClick={() => setPlayingId(testimonial.id)}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-14 h-14 rounded-full backdrop-blur-sm flex items-center justify-center border-2 transition-all"
                                                    style={{
                                                        backgroundColor: `${primary}20`,
                                                        borderColor: primary
                                                    }}
                                                >
                                                    <Play className="w-6 h-6 fill-current ml-0.5" style={{ color: primary }} />
                                                </motion.div>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : null}

                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    {testimonial.avatar_url ? (
                                        <img
                                            src={testimonial.avatar_url}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-xl object-cover ring-2"
                                            style={{ '--tw-ring-color': `${primary}30` } as React.CSSProperties}
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                        />
                                    ) : (
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center font-medium"
                                            style={{
                                                backgroundColor: `${primary}20`,
                                                color: primary
                                            }}
                                        >
                                            {testimonial.name[0]}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-bold text-sm" style={{ color: authorText }}>
                                            {testimonial.name}
                                        </p>
                                        <p className={`text-xs ${subtextClasses(darkMode)}`} style={{ color: roleText }}>
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4" style={{ color: mainText }}>
                                    <ExpandableContent
                                        content={testimonial.content || ""}
                                        maxLength={120}
                                        darkMode={darkMode}
                                        isVideo={false}
                                        textColor={mainText}
                                    />
                                </div>

                                <TestimonialStars
                                    darkMode={darkMode}
                                    rating={testimonial.rating}
                                    size="w-4 h-4"
                                    color={primary}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* See More Button */}
            {displayItems.length > 6 && !showAll && (
                <div className="flex justify-center pb-8">
                    <button
                        onClick={() => setShowAll(true)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg border backdrop-blur-sm`}
                        style={{
                            backgroundColor: cardBg,
                            color: mainText,
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                        }}
                    >
                        See More
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingCardsLayout;
