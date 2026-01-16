import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { TestimonialStars, ExpandableContent } from "@/components/widgets/TestimonialCard";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

interface RadialBurstLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const RadialBurstLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: RadialBurstLayoutProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const isMobile = previewDevice === "mobile";

    const activeTestimonial = displayItems[activeIndex];
    const isVideo = activeTestimonial?.type === "video";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    const next = () => {
        setIsPlaying(false);
        setActiveIndex((prev) => (prev + 1) % displayItems.length);
    };

    const prev = () => {
        setIsPlaying(false);
        setActiveIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    };

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div
                className="py-20 px-4 relative overflow-hidden min-h-[700px] flex items-center justify-center"
            >
                {/* Radial burst lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-px h-[200%] bg-gradient-to-b from-transparent to-transparent"
                            style={{
                                transform: `rotate(${i * 15}deg)`,
                                backgroundImage: `linear-gradient(to bottom, transparent, ${primary}20, transparent)`
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                        />
                    ))}
                </div>

                {/* Animated circles */}
                {[1, 2, 3, 4].map((ring) => (
                    <motion.div
                        key={ring}
                        className="absolute rounded-full border"
                        style={{
                            width: `${ring * 200}px`,
                            height: `${ring * 200}px`,
                            borderColor: `${primary}20`
                        }}
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: ring * 0.5,
                        }}
                    />
                ))}

                <div className="relative z-10 max-w-2xl w-full">
                    {/* Main testimonial card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className={`rounded-[2rem] overflow-hidden ${customStyles.showShadow ? "shadow-2xl" : ""} ${customStyles.showBorder ? "border-2" : "border"}`}
                            style={{
                                backgroundColor: cardBg,
                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                            }}
                        >
                            {isVideo ? (
                                <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                    <AnimatePresence>
                                        {isPlaying ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0"
                                            >
                                                <iframe
                                                    src={`${activeTestimonial.video_url}?autoplay=1`}
                                                    className="w-full h-full"
                                                    allow="autoplay"
                                                    allowFullScreen
                                                />
                                                <button
                                                    onClick={() => setIsPlaying(false)}
                                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                onClick={() => setIsPlaying(true)}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="relative"
                                                >
                                                    {/* Pulsing rings */}
                                                    {[1, 2, 3].map((ring) => (
                                                        <motion.div
                                                            key={ring}
                                                            className="absolute inset-0 rounded-full bg-white/20"
                                                            animate={{
                                                                scale: [1, 2],
                                                                opacity: [0.5, 0],
                                                            }}
                                                            transition={{
                                                                duration: 1.5,
                                                                repeat: Infinity,
                                                                delay: ring * 0.3,
                                                            }}
                                                        />
                                                    ))}
                                                    <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : null}

                            <div className="p-8">
                                {!isVideo && <TestimonialStars rating={activeTestimonial.rating} className="mb-4" size="w-5 h-5" color={primary} darkMode={darkMode} />}

                                <div style={{ color: mainText }} className="mb-6">
                                    <ExpandableContent
                                        content={activeTestimonial.content || ""}
                                        maxLength={150}
                                        darkMode={darkMode}
                                        isVideo={false}
                                        textColor={mainText}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    {activeTestimonial.avatar_url ? (
                                        <img
                                            src={activeTestimonial.avatar_url}
                                            alt={activeTestimonial.name}
                                            className="w-14 h-14 rounded-full object-cover ring-4"
                                            style={{ '--tw-ring-color': `${primary}20` } as React.CSSProperties}
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                        />
                                    ) : (
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${primary}20` }}
                                        >
                                            <span className="text-xl font-medium" style={{ color: primary }}>{activeTestimonial.name[0]}</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold" style={{ color: authorText }}>{activeTestimonial.name}</p>
                                        <p className="text-sm opacity-80" style={{ color: roleText }}>{activeTestimonial.title}</p>
                                        <p className="text-sm font-medium" style={{ color: primary }}>{activeTestimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-primary/10 transition-colors"
                            style={{
                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                backgroundColor: cardBg,
                                color: mainText
                            }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dot indicators */}
                        <div className="flex gap-2">
                            {displayItems.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsPlaying(false);
                                        setActiveIndex(i);
                                    }}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8" : ""
                                        }`}
                                    style={{
                                        backgroundColor: i === activeIndex ? primary : (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-primary/10 transition-colors"
                            style={{
                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                backgroundColor: cardBg,
                                color: mainText
                            }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadialBurstLayout;
