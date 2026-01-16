import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { TestimonialStars, ExpandableContent, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Quote, Play, X, ChevronDown } from "lucide-react";

interface MasonryWallLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const MasonryWallLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: MasonryWallLayoutProps) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    // Determine number of columns based on device
    const numColumns = previewDevice === "mobile" ? 1 : previewDevice === "tablet" ? 2 : 3;
    const visibleTestimonials = showAll ? displayItems : displayItems.slice(0, 6); // Or maybe 9? Original was 6.

    // Distribute testimonials into columns
    const columns = useMemo(() => {
        const cols: Testimonial[][] = Array.from({ length: numColumns }, () => []);
        visibleTestimonials.forEach((t, i) => {
            cols[i % numColumns].push(t);
        });
        return cols;
    }, [visibleTestimonials, numColumns]);

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="p-4 lg:p-8">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
                    gap: '1.5rem'
                }}>
                    {columns.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-6">
                            {column.map((testimonial, index) => {
                                const isVideo = testimonial.type === "video";
                                const tId = testimonial.id || `${colIndex}-${index}`;

                                return (
                                    <motion.div
                                        key={tId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (colIndex * 0.1) + (index * 0.15) }}
                                        className={`rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${customStyles.showShadow ? "shadow-lg hover:shadow-xl" : "hover:shadow-lg"} ${customStyles.showBorder ? "border-2" : "border"}`}
                                        style={{
                                            backgroundColor: cardBg,
                                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                        }}
                                    >
                                        {isVideo ? (
                                            <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                                <AnimatePresence>
                                                    {playingId === tId ? (
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
                                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                            onClick={() => setPlayingId(tId)}
                                                        >
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                className="w-14 h-14 rounded-full backdrop-blur-sm flex items-center justify-center border-2"
                                                                style={{
                                                                    backgroundColor: `${primary}20`,
                                                                    borderColor: primary,
                                                                    color: primary
                                                                }}
                                                            >
                                                                <Play className="w-6 h-6 fill-current ml-0.5" />
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : null}

                                        <div className="p-6">
                                            {!isVideo && (
                                                <Quote className="w-8 h-8 mb-4 opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: primary }} />
                                            )}

                                            <div style={{ color: mainText }} className="mb-4">
                                                <ExpandableContent
                                                    content={testimonial.content || ""}
                                                    maxLength={150}
                                                    darkMode={darkMode}
                                                    isVideo={false}
                                                    textColor={mainText}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                                <div className="flex items-center gap-3">
                                                    {testimonial.avatar_url ? (
                                                        <img
                                                            src={testimonial.avatar_url}
                                                            alt={testimonial.name}
                                                            className="w-10 h-10 rounded-full object-cover ring-2"
                                                            style={{ '--tw-ring-color': `${primary}10` } as React.CSSProperties}
                                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                                            style={{ backgroundColor: `${primary}10` }}
                                                        >
                                                            <span className="font-medium" style={{ color: primary }}>
                                                                {testimonial.name[0]}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold" style={{ color: authorText }}>
                                                            {testimonial.name}
                                                        </p>
                                                        <p className={`text-xs ${subtextClasses(darkMode)}`} style={{ color: roleText }}>
                                                            {testimonial.company || "Verified Customer"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <TestimonialStars rating={testimonial.rating} size="w-3.5 h-3.5" color={primary} darkMode={darkMode} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                {displayItems.length > 6 && !showAll && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mt-12 mb-8"
                    >
                        <button
                            onClick={() => setShowAll(true)}
                            className="flex items-center gap-2 px-8 py-3 rounded-full border transition-all hover:scale-105"
                            style={{
                                backgroundColor: cardBg,
                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                color: mainText,
                                boxShadow: customStyles.showShadow ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            See More Testimonials
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MasonryWallLayout;
