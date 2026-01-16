import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { TestimonialStars, ExpandableContent, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Play, X, ArrowRight, ArrowLeft } from "lucide-react";

interface StackedCardsLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const StackedCardsLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: StackedCardsLayoutProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    const handleNext = () => {
        setIsPlaying(false);
        setActiveIndex((prev) => (prev + 1) % displayItems.length);
    };

    const handlePrev = () => {
        setIsPlaying(false);
        setActiveIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    };

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div
                className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center min-h-[500px] sm:min-h-[600px]"
            >
                <div className="relative w-full max-w-sm sm:max-w-md h-[420px] sm:h-[480px]">
                    {displayItems.slice(0, 5).map((testimonial, index) => {
                        const isActive = index === activeIndex;
                        const offset = (index - activeIndex + displayItems.length) % displayItems.length;
                        const isVideo = testimonial.type === "video";

                        // Limit visible stack
                        if (offset > 3) return null;

                        return (
                            <motion.div
                                key={testimonial.id || index}
                                className={`absolute inset-0 rounded-[2rem] overflow-hidden cursor-pointer ${customStyles.showShadow ? "shadow-2xl" : "shadow-lg"} ${customStyles.showBorder ? "border-2" : "border"}`}
                                style={{
                                    backgroundColor: cardBg,
                                    borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                    zIndex: 10 - offset,
                                }}
                                initial={false}
                                animate={{
                                    scale: 1 - offset * 0.05,
                                    y: offset * 16,
                                    opacity: offset > 2 ? 0 : 1,
                                    rotateZ: offset * 1.5,
                                }}
                                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                                onClick={() => !isActive && setActiveIndex(index)}
                            >
                                {isVideo ? (
                                    <div className="relative h-44 sm:h-52 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                        <AnimatePresence>
                                            {isPlaying && isActive ? (
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
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsPlaying(false);
                                                        }}
                                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                                                    >
                                                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isActive) setIsPlaying(true);
                                                    }}
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-sm flex items-center justify-center border-2"
                                                        style={{
                                                            backgroundColor: `${primary}20`,
                                                            borderColor: primary,
                                                            color: primary
                                                        }}
                                                    >
                                                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : null}

                                <div className="p-6 sm:p-8">
                                    {!isVideo && <TestimonialStars rating={testimonial.rating} className="mb-4" size="w-4 h-4" color={primary} darkMode={darkMode} />}

                                    <div style={{ color: mainText }} className="mb-6">
                                        <ExpandableContent
                                            content={testimonial.content || ""}
                                            maxLength={120}
                                            darkMode={darkMode}
                                            isVideo={false}
                                            textColor={mainText}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            {testimonial.author_avatar_url ? (
                                                <img
                                                    src={testimonial.author_avatar_url}
                                                    alt={testimonial.author_name}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 ring-2"
                                                    style={{ '--tw-ring-color': `${primary}10` } as React.CSSProperties}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: `${primary}20` }}
                                                >
                                                    <span className="font-medium text-sm sm:text-base" style={{ color: primary }}>{testimonial.author_name[0]}</span>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm sm:text-base truncate" style={{ color: authorText }}>{testimonial.author_name}</p>
                                                <p className={`text-xs ${subtextClasses(darkMode)} truncate`} style={{ color: roleText }}>{testimonial.author_company}</p>
                                            </div>
                                        </div>
                                        {isVideo && <TestimonialStars rating={testimonial.rating} size="w-3.5 h-3.5" color={primary} darkMode={darkMode} />}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center gap-4 mt-16 sm:mt-20">
                    <motion.button
                        onClick={handlePrev}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                        style={{
                            backgroundColor: cardBg,
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                            color: mainText
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>

                    {/* Progress dots */}
                    <div className="flex gap-1.5 sm:gap-2">
                        {displayItems.slice(0, 5).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setIsPlaying(false);
                                    setActiveIndex(i);
                                }}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-4 sm:w-6" : ""
                                    }`}
                                style={{
                                    backgroundColor: i === activeIndex ? primary : (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
                                }}
                            />
                        ))}
                    </div>

                    <motion.button
                        onClick={handleNext}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                            backgroundColor: primary,
                            color: '#ffffff'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default StackedCardsLayout;
