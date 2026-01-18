import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

interface OrbitRingLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const OrbitRingLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: OrbitRingLayoutProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const isMobile = previewDevice === "mobile";

    const activeTestimonial = hoveredIndex !== null ? displayItems[hoveredIndex] : null;
    const mobileTestimonial = displayItems[mobileActiveIndex];
    const isVideo = activeTestimonial?.type === "video";
    const isMobileVideo = mobileTestimonial?.type === "video";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    const nextMobile = () => {
        setIsPlaying(false);
        setMobileActiveIndex((prev) => (prev + 1) % Math.min(displayItems.length, 6));
    };

    const prevMobile = () => {
        setIsPlaying(false);
        setMobileActiveIndex((prev) => (prev - 1 + Math.min(displayItems.length, 6)) % Math.min(displayItems.length, 6));
    };

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div
                className="py-16 sm:py-20 px-4 relative overflow-hidden min-h-[500px] sm:min-h-[600px]"
            >
                {/* Orbit rings background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    {[1, 2, 3].map((ring) => (
                        <motion.div
                            key={ring}
                            className="absolute rounded-full border border-dashed"
                            style={{
                                width: `${ring * 140}px`,
                                height: `${ring * 140}px`,
                                borderColor: primary,
                                opacity: 0.1 * (4 - ring)
                            }}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 30 * ring,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    ))}
                </div>

                {/* Desktop Layout - Orbit with hover */}
                {!isMobile && (
                    <div className="flex max-w-4xl mx-auto relative z-10 items-center justify-center min-h-[400px]">
                        {/* Orbiting avatars */}
                        <div className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]">
                            {displayItems.slice(0, 8).map((t, i) => {
                                const totalAvatars = Math.min(displayItems.length, 8);
                                const angle = (i / totalAvatars) * Math.PI * 2 - Math.PI / 2;
                                const radius = 160;

                                return (
                                    <motion.div
                                        key={t.id || i}
                                        className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden cursor-pointer transition-all duration-300 shadow-lg ${hoveredIndex === i
                                            ? "scale-125 z-20"
                                            : hoveredIndex !== null
                                                ? "opacity-40 scale-90"
                                                : "opacity-80 hover:opacity-100"
                                            }`}
                                        style={{
                                            left: `calc(50% + ${Math.cos(angle) * radius}px - 24px)`,
                                            top: `calc(50% + ${Math.sin(angle) * radius}px - 24px)`,
                                            boxShadow: hoveredIndex === i ? `0 0 0 2px ${primary}` : 'none'
                                        }}
                                        onMouseEnter={() => {
                                            setHoveredIndex(i);
                                            setIsPlaying(false);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredIndex(null);
                                            setIsPlaying(false);
                                        }}
                                        whileHover={{ scale: 1.3 }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: hoveredIndex === i ? 1 : hoveredIndex !== null ? 0.4 : 0.8, scale: hoveredIndex === i ? 1.25 : 1 }}
                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                    >
                                        {t.avatar_url ? (
                                            <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
                                                <span className="font-medium" style={{ color: primary }}>{t.name[0]}</span>
                                            </div>
                                        )}
                                        {t.type === "video" && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Play className="w-4 h-4 text-white fill-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Center content - only shows on hover */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <AnimatePresence mode="wait">
                                    {hoveredIndex !== null && activeTestimonial ? (
                                        <motion.div
                                            key={hoveredIndex}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.25 }}
                                            className={`w-64 sm:w-80 overflow-hidden pointer-events-auto rounded-[1.5rem] ${customStyles.showShadow ? "shadow-xl" : "shadow-lg"} ${customStyles.showBorder ? "border-2" : "border"}`}
                                            style={{
                                                backgroundColor: cardBg,
                                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                            }}
                                            onMouseEnter={() => setHoveredIndex(hoveredIndex)}
                                            onMouseLeave={() => {
                                                setHoveredIndex(null);
                                                setIsPlaying(false);
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
                                                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </motion.div>
                                                        ) : (
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                                onClick={() => setIsPlaying(true)}
                                                            >
                                                                <motion.div
                                                                    whileHover={{ scale: 1.1 }}
                                                                    className="w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center border-2"
                                                                    style={{
                                                                        backgroundColor: `${primary}20`,
                                                                        borderColor: primary
                                                                    }}
                                                                >
                                                                    <Play className="w-5 h-5 fill-current ml-0.5" style={{ color: primary }} />
                                                                </motion.div>
                                                            </div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : null}

                                            <div className="p-4">
                                                {!isVideo && <TestimonialStars rating={activeTestimonial.rating} className="mb-2" size="w-3.5 h-3.5" color={primary} darkMode={darkMode} />}
                                                <p className="text-sm leading-relaxed mb-3 line-clamp-3" style={{ color: mainText }}>
                                                    "{activeTestimonial.content}"
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {activeTestimonial.avatar_url ? (
                                                        <img
                                                            src={activeTestimonial.avatar_url}
                                                            alt={activeTestimonial.name}
                                                            className="w-8 h-8 rounded-full object-cover ring-2"
                                                            style={{ '--tw-ring-color': `${primary}20` } as React.CSSProperties}
                                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primary}10` }}>
                                                            <span className="font-medium text-sm" style={{ color: primary }}>{activeTestimonial.name[0]}</span>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-xs truncate" style={{ color: authorText }}>{activeTestimonial.name}</p>
                                                        <p className="text-xs truncate" style={{ color: roleText }}>{activeTestimonial.title || activeTestimonial.company}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            <p className="text-sm font-medium opacity-60" style={{ color: mainText }}>Hover over an avatar</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Layout - Orbit style with avatars around center card */}
                {isMobile && (
                    <div className="relative min-h-[420px] flex items-center justify-center">
                        <div className="relative w-[300px] h-[300px]">
                            {/* Orbiting avatars on mobile */}
                            {displayItems.slice(0, 6).map((t, i) => {
                                const totalAvatars = Math.min(displayItems.length, 6);
                                const angle = (i / totalAvatars) * Math.PI * 2 - Math.PI / 2;
                                const radius = 110;

                                return (
                                    <motion.div
                                        key={t.id || i}
                                        className={`absolute w-10 h-10 rounded-full overflow-hidden cursor-pointer transition-all duration-300 shadow-md ${mobileActiveIndex === i
                                            ? "scale-125 z-20"
                                            : "opacity-60"
                                            }`}
                                        style={{
                                            left: `calc(50% + ${Math.cos(angle) * radius}px - 20px)`,
                                            top: `calc(50% + ${Math.sin(angle) * radius}px - 20px)`,
                                            boxShadow: mobileActiveIndex === i ? `0 0 0 2px ${primary}` : 'none'
                                        }}
                                        onClick={() => {
                                            setMobileActiveIndex(i);
                                            setIsPlaying(false);
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: mobileActiveIndex === i ? 1 : 0.6, scale: mobileActiveIndex === i ? 1.25 : 1 }}
                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                    >
                                        {t.avatar_url ? (
                                            <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
                                                <span className="text-sm font-medium" style={{ color: primary }}>{t.name[0]}</span>
                                            </div>
                                        )}
                                        {t.type === "video" && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Play className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Center card on mobile */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mobileActiveIndex}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.25 }}
                                        className={`w-44 overflow-hidden rounded-[1.2rem] ${customStyles.showShadow ? "shadow-lg" : "shadow-md"} ${customStyles.showBorder ? "border" : ""}`}
                                        style={{
                                            backgroundColor: cardBg,
                                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                        }}
                                    >
                                        {isMobileVideo ? (
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
                                                                src={`${mobileTestimonial.video_url}?autoplay=1`}
                                                                className="w-full h-full"
                                                                allow="autoplay"
                                                                allowFullScreen
                                                            />
                                                            <button
                                                                onClick={() => setIsPlaying(false)}
                                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white"
                                                            >
                                                                <X className="w-2.5 h-2.5" />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                            onClick={() => setIsPlaying(true)}
                                                        >
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                className="w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center border-2"
                                                                style={{
                                                                    backgroundColor: `${primary}20`,
                                                                    borderColor: primary
                                                                }}
                                                            >
                                                                <Play className="w-4 h-4 fill-current ml-0.5" style={{ color: primary }} />
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : null}

                                        <div className="p-3">
                                            {!isMobileVideo && <TestimonialStars rating={mobileTestimonial.rating} className="mb-1" size="w-3 h-3" color={primary} darkMode={darkMode} />}
                                            <p className="text-xs leading-relaxed mb-2 line-clamp-3" style={{ color: mainText }}>
                                                "{mobileTestimonial.content}"
                                            </p>
                                            <p className="font-medium text-xs truncate" style={{ color: authorText }}>{mobileTestimonial.name}</p>
                                            <p className="text-xs truncate" style={{ color: roleText }}>{mobileTestimonial.company}</p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 px-4 pb-2">
                            <button
                                onClick={prevMobile}
                                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-primary/10 transition-colors flex-shrink-0"
                                style={{
                                    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                    color: mainText
                                }}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex gap-2">
                                {displayItems.slice(0, 5).map((t, i) => (
                                    <button
                                        key={t.id || i}
                                        onClick={() => {
                                            setIsPlaying(false);
                                            setMobileActiveIndex(i);
                                        }}
                                        className={`relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${i === mobileActiveIndex
                                            ? "ring-2 scale-110"
                                            : "opacity-50"
                                            }`}
                                        style={{ '--tw-ring-color': primary } as React.CSSProperties}
                                    >
                                        {t.avatar_url ? (
                                            <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
                                                <span className="text-xs font-medium" style={{ color: primary }}>{t.name[0]}</span>
                                            </div>
                                        )}
                                        {t.type === "video" && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Play className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={nextMobile}
                                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                                style={{
                                    backgroundColor: primary,
                                    color: '#ffffff'
                                }}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrbitRingLayout;
