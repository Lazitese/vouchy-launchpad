import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { TestimonialStars, ExpandableContent, subtextClasses } from "@/components/widgets/TestimonialCard";
import { ChevronLeft, ChevronRight, Quote, Play, X, Pause } from "lucide-react";

interface CinematicSliderLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const CinematicSliderLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: CinematicSliderLayoutProps) => {
    const [current, setCurrent] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const isMobile = previewDevice === "mobile";

    // Auto-advance if not playing video
    useEffect(() => {
        if (isPlaying) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % displayItems.length);
        }, 8000); // Slower, 8s rotation for premium feel

        return () => clearInterval(timer);
    }, [displayItems.length, isPlaying]);

    const next = () => {
        setIsPlaying(false);
        setCurrent((prev) => (prev + 1) % displayItems.length);
    };

    const prev = () => {
        setIsPlaying(false);
        setCurrent((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    };

    const testimonial = displayItems[current];
    const isVideo = testimonial?.type === "video";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    // Get background image for ambient effect
    const ambientImage = testimonial?.avatar_url || '';

    return (
        <div className="w-full h-full overflow-hidden relative group/container bg-gray-50 dark:bg-gray-950">
            {/* Ambient Background Effect */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 -z-10 overflow-hidden"
                >
                    {ambientImage && (
                        <div
                            className="w-full h-full bg-cover bg-center blur-3xl scale-125 saturate-150"
                            style={{ backgroundImage: `url(${ambientImage})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50 dark:from-black dark:via-transparent dark:to-black/50" />
                </motion.div>
            </AnimatePresence>

            <div className={`w-full h-full flex flex-col justify-center items-center py-4 ${isMobile ? 'px-0.5' : 'md:px-12'} relative z-10`}>
                {/* Main Content Area */}
                <div className="w-full max-w-6xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                            className={`relative overflow-hidden shadow-2xl ${isMobile
                                ? 'rounded-xl'
                                : 'rounded-[2rem] md:grid md:grid-cols-12'
                                }`}
                            style={{
                                backgroundColor: isMobile ? cardBg : (darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                                backdropFilter: isMobile ? 'none' : 'blur(20px)',
                                borderColor: isMobile ? (customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')) : 'transparent',
                            }}
                        >
                            {isMobile ? (
                                /* Mobile: News Ticker Card Design */
                                <>
                                    {/* Featured Badge */}
                                    <div
                                        className="absolute top-0 left-0 z-10 px-3 py-1.5 flex items-center gap-2 rounded-br-2xl text-white text-xs font-medium"
                                        style={{ backgroundColor: primary }}
                                    >
                                        <Quote className="w-3.5 h-3.5" />
                                        <span>Featured</span>
                                    </div>

                                    {/* Video/Image Section */}
                                    {isVideo ? (
                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                            {isPlaying ? (
                                                <div className="absolute inset-0 z-20">
                                                    <iframe
                                                        src={`${testimonial.video_url}?autoplay=1`}
                                                        className="w-full h-full"
                                                        allow="autoplay"
                                                        allowFullScreen
                                                    />
                                                    <button
                                                        onClick={() => setIsPlaying(false)}
                                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center cursor-pointer pt-6"
                                                    onClick={() => setIsPlaying(true)}
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-xl text-white"
                                                        style={{ backgroundColor: primary }}
                                                    >
                                                        <Play className="w-7 h-7 fill-current ml-0.5" />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-10 w-full"></div>
                                    )}

                                    {/* Content Section */}
                                    <div className="p-5">
                                        {!isVideo && (
                                            <TestimonialStars
                                                rating={testimonial.rating}
                                                className="mb-3"
                                                size="w-4 h-4"
                                                color={primary}
                                                darkMode={darkMode}
                                            />
                                        )}

                                        <div style={{ color: mainText }} className="mb-4 text-sm leading-relaxed">
                                            <ExpandableContent
                                                content={testimonial.content || ""}
                                                maxLength={150}
                                                darkMode={darkMode}
                                                isVideo={false}
                                                textColor={mainText}
                                            />
                                        </div>

                                        {/* Author Info */}
                                        <div
                                            className="flex items-center gap-3 pt-3 border-t"
                                            style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                                        >
                                            {testimonial.avatar_url ? (
                                                <img
                                                    src={testimonial.avatar_url}
                                                    alt={testimonial.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: `${primary}20` }}
                                                >
                                                    <span className="font-medium" style={{ color: primary }}>
                                                        {testimonial.name[0]}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-sm" style={{ color: authorText }}>
                                                    {testimonial.name}
                                                </p>
                                                <p className="text-xs opacity-70" style={{ color: roleText }}>
                                                    {testimonial.company || testimonial.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Desktop: Split Screen Design */
                                <>
                                    {/* Media Section (Video/Image) - Left Side on Desktop (5/12 cols) */}
                                    <div className="md:col-span-5 h-[450px] relative">
                                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20">
                                            {isVideo ? (
                                                <div className="w-full h-full relative group/media">
                                                    {isPlaying ? (
                                                        <div className="w-full h-full relative z-20">
                                                            <iframe
                                                                src={`${testimonial.video_url}?autoplay=1`}
                                                                className="w-full h-full object-cover"
                                                                allow="autoplay"
                                                                allowFullScreen
                                                            />
                                                            <button
                                                                onClick={() => setIsPlaying(false)}
                                                                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="w-full h-full relative cursor-pointer overflow-hidden"
                                                            onClick={() => setIsPlaying(true)}
                                                        >
                                                            <img
                                                                src={testimonial.avatar_url || 'https://via.placeholder.com/800x600'}
                                                                alt="Testimonial thumbnail"
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover/media:scale-105"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                                                                <motion.div
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl"
                                                                >
                                                                    <Play className="w-6 h-6 fill-current ml-1" />
                                                                </motion.div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full relative overflow-hidden">
                                                    {testimonial.avatar_url ? (
                                                        <img
                                                            src={testimonial.avatar_url}
                                                            alt={testimonial.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center text-9xl font-serif opacity-10"
                                                            style={{ color: primary }}
                                                        >
                                                            "
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Section - Right Side on Desktop (7/12 cols) */}
                                    <div className="md:col-span-7 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                                        <div className="relative z-10">
                                            <Quote
                                                className="w-10 h-10 mb-6 opacity-20 transform -translate-x-2 -translate-y-2"
                                                style={{ color: primary }}
                                            />

                                            <blockquote
                                                className="font-serif italic text-xl lg:text-2xl xl:text-3xl leading-relaxed mb-8 opacity-90"
                                                style={{ color: mainText }}
                                            >
                                                "{testimonial.content}"
                                            </blockquote>

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-4">
                                                    {testimonial.avatar_url && (
                                                        <div
                                                            className="w-12 h-12 rounded-full p-0.5"
                                                            style={{ background: `linear-gradient(135deg, ${primary}, transparent)` }}
                                                        >
                                                            <img
                                                                src={testimonial.avatar_url}
                                                                alt={testimonial.name}
                                                                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-lg tracking-tight" style={{ color: authorText }}>
                                                            {testimonial.name}
                                                        </h4>
                                                        <p className="text-sm font-medium opacity-60 uppercase tracking-widest" style={{ color: roleText }}>
                                                            {testimonial.company || testimonial.title}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <TestimonialStars
                                                        rating={testimonial.rating}
                                                        size="w-5 h-5"
                                                        color="#fbbf24"
                                                        darkMode={darkMode}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {/* Navigation Buttons (Desktop) */}
                    <div className={`absolute top-1/2 -translate-y-1/2 -left-16 hidden lg:block`}>
                        <button
                            onClick={prev}
                            className="p-3 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 text-current hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
                            style={{ color: mainText }}
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                    <div className={`absolute top-1/2 -translate-y-1/2 -right-16 hidden lg:block`}>
                        <button
                            onClick={next}
                            className="p-3 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 text-current hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
                            style={{ color: mainText }}
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Buttons (Simple) */}
                {isMobile && (
                    <div className="mt-6 flex items-center justify-center gap-8">
                        <button
                            onClick={prev}
                            className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
                            style={{ color: mainText }}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={next}
                            className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
                            style={{ color: mainText }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CinematicSliderLayout;
