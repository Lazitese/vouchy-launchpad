import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Play, X } from "lucide-react";

interface GlassPrismLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const GlassPrismLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: GlassPrismLayoutProps) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const isMobile = previewDevice === "mobile";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981'; // emerald-500 as default

    // Masonry distribution
    const columns = [[], [], []] as typeof displayItems[];
    displayItems.forEach((t, i) => columns[i % 3].push(t));

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent relative">
            {/* Subtle background gradient with brand color */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    background: `linear-gradient(135deg, ${primary}08 0%, transparent 50%, ${primary}10 100%)`
                }}
            />

            <div className={`grid gap-4 lg:gap-6 pb-20 pt-4 px-6 relative z-10 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-4 lg:gap-6">
                        {column.map((testimonial, index) => {
                            const isVideo = testimonial.type === "video";

                            return (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20, rotateY: -15 }}
                                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                    transition={{ delay: (colIndex * 0.1) + (index * 0.15), duration: 0.6 }}
                                    whileHover={{ scale: 1.02, rotateY: 5 }}
                                    className="relative group"
                                    style={{ perspective: "1000px" }}
                                >
                                    {/* Glass card with brand styling */}
                                    <div
                                        className={`relative backdrop-blur-xl rounded-[2rem] overflow-hidden ${customStyles.showShadow ? "shadow-xl" : "shadow-md"} ${customStyles.showBorder ? "border-2" : "border"}`}
                                        style={{
                                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                                        }}
                                    >
                                        {/* Refraction effect on edges using brand color */}
                                        <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                                            <div
                                                className="absolute top-0 left-0 right-0 h-px opacity-50"
                                                style={{ background: `linear-gradient(to right, transparent, ${primary}80, transparent)` }}
                                            />
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-px opacity-30"
                                                style={{ background: `linear-gradient(to right, transparent, ${primary}60, transparent)` }}
                                            />
                                            <div
                                                className="absolute top-0 bottom-0 left-0 w-px opacity-30"
                                                style={{ background: `linear-gradient(to bottom, transparent, ${primary}60, transparent)` }}
                                            />
                                            <div
                                                className="absolute top-0 bottom-0 right-0 w-px opacity-30"
                                                style={{ background: `linear-gradient(to bottom, transparent, ${primary}60, transparent)` }}
                                            />
                                        </div>

                                        {/* Subtle glow on hover using brand color */}
                                        <motion.div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
                                            style={{
                                                background: `linear-gradient(135deg, ${primary}10, transparent, ${primary}15)`
                                            }}
                                        />

                                        {isVideo ? (
                                            <div className="relative aspect-video">
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
                                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center cursor-pointer"
                                                            onClick={() => setPlayingId(testimonial.id)}
                                                        >
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                className="w-16 h-16 rounded-full backdrop-blur-md flex items-center justify-center border-2"
                                                                style={{
                                                                    backgroundColor: `${primary}20`,
                                                                    borderColor: `${primary}60`
                                                                }}
                                                            >
                                                                <Play className="w-7 h-7 fill-current ml-1" style={{ color: primary }} />
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : null}

                                        <div className="p-6">
                                            {!isVideo && (
                                                <TestimonialStars
                                                    rating={testimonial.rating}
                                                    darkMode={darkMode}
                                                    className="mb-4"
                                                    size="w-4 h-4"
                                                    color={primary}
                                                />
                                            )}
                                            <div className="mb-4" style={{ color: mainText }}>
                                                <ExpandableContent
                                                    content={testimonial.content || ""}
                                                    maxLength={120}
                                                    darkMode={darkMode}
                                                    isVideo={false}
                                                    textColor={mainText}
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {testimonial.avatar_url ? (
                                                    <img
                                                        src={testimonial.avatar_url}
                                                        alt={testimonial.name}
                                                        className="w-10 h-10 rounded-full object-cover ring-2"
                                                        style={{ '--tw-ring-color': `${primary}30` } as React.CSSProperties}
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
                                                        style={{
                                                            backgroundColor: `${primary}30`,
                                                            color: primary
                                                        }}
                                                    >
                                                        {testimonial.name[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm" style={{ color: authorText }}>
                                                        {testimonial.name}
                                                    </p>
                                                    <p className={`text-xs ${subtextClasses(darkMode)}`} style={{ color: roleText }}>
                                                        {testimonial.company}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlassPrismLayout;
