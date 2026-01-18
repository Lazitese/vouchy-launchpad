import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { TestimonialStars, ExpandableContent } from "@/components/widgets/TestimonialCard";
import { Play, X, Award, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsTickerHeroLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const NewsTickerHeroLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: NewsTickerHeroLayoutProps) => {
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
                className="py-8"
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* Desktop Layout */}
                    {!isMobile && (
                        <div className="grid grid-cols-5 gap-8">
                            {/* Main feature */}
                            <div className="col-span-3">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.4 }}
                                        className={`rounded-[2rem] overflow-hidden relative ${customStyles.showShadow ? "shadow-xl" : ""} ${customStyles.showBorder ? "border-2" : "border"}`}
                                        style={{
                                            backgroundColor: cardBg,
                                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                        }}
                                    >
                                        {/* Featured badge */}
                                        <div
                                            className="absolute top-0 left-0 z-10 px-4 py-2 flex items-center gap-2 rounded-br-2xl text-white font-medium text-sm"
                                            style={{ backgroundColor: primary }}
                                        >
                                            <Award className="w-4 h-4" />
                                            <span>Featured Testimonial</span>
                                        </div>

                                        {isVideo ? (
                                            <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 mt-0">
                                                <AnimatePresence>
                                                    {isPlaying ? (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="absolute inset-0 z-20"
                                                        >
                                                            <iframe
                                                                src={`${activeTestimonial.video_url}?autoplay=1`}
                                                                className="w-full h-full"
                                                                allow="autoplay"
                                                                allowFullScreen
                                                            />
                                                            <button
                                                                onClick={() => setIsPlaying(false)}
                                                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0 flex items-center justify-center cursor-pointer pt-8"
                                                            onClick={() => setIsPlaying(true)}
                                                        >
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl text-white"
                                                                style={{ backgroundColor: primary }}
                                                            >
                                                                <Play className="w-10 h-10 fill-current ml-1" />
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div className="h-12 w-full"></div> /* Spacer for badge */
                                        )}

                                        <div className="p-8">
                                            {!isVideo && <TestimonialStars rating={activeTestimonial.rating} className="mb-4" size="w-5 h-5" color={primary} darkMode={darkMode} />}

                                            <div style={{ color: mainText }} className="mb-6">
                                                <ExpandableContent
                                                    content={activeTestimonial.content || ""}
                                                    maxLength={200}
                                                    darkMode={darkMode}
                                                    isVideo={false}
                                                    textColor={mainText}
                                                />
                                            </div>

                                            <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                                {activeTestimonial.avatar_url ? (
                                                    <img
                                                        src={activeTestimonial.avatar_url}
                                                        alt={activeTestimonial.name}
                                                        className="w-14 h-14 rounded-xl object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                                                        style={{ backgroundColor: `${primary}20` }}
                                                    >
                                                        <span className="text-xl font-medium" style={{ color: primary }}>{activeTestimonial.name[0]}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-lg" style={{ color: authorText }}>{activeTestimonial.name}</p>
                                                    <p className="text-sm opacity-80" style={{ color: roleText }}>{activeTestimonial.company || activeTestimonial.title || "Verified Customer"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Side list */}
                            <div className="col-span-2 space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                                {displayItems.slice(0, 8).map((testimonial, index) => {
                                    const isActive = index === activeIndex;

                                    return (
                                        <motion.div
                                            key={testimonial.id || index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => {
                                                setActiveIndex(index);
                                                setIsPlaying(false);
                                            }}
                                            className={`p-4 cursor-pointer transition-all rounded-xl border ${isActive ? "ring-2" : "hover:bg-black/5 dark:hover:bg-white/5"
                                                }`}
                                            style={{
                                                backgroundColor: isActive ? `${primary}10` : cardBg,
                                                borderColor: isActive ? primary : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                                '--tw-ring-color': primary
                                            } as React.CSSProperties}
                                        >
                                            <div className="flex items-center gap-3">
                                                {testimonial.avatar_url ? (
                                                    <img
                                                        src={testimonial.avatar_url}
                                                        alt={testimonial.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
                                                        <span className="font-medium" style={{ color: primary }}>{testimonial.name[0]}</span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm truncate" style={{ color: authorText }}>{testimonial.name}</p>
                                                        {testimonial.type === "video" && (
                                                            <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${primary}20`, color: primary }}>Video</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs truncate opacity-70" style={{ color: roleText }}>{testimonial.company || testimonial.title}</p>
                                                </div>
                                                <TestimonialStars rating={testimonial.rating} size="w-3 h-3" color={primary} darkMode={darkMode} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Mobile Layout - Card Slider */}
                    {isMobile && (
                        <div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className={`rounded-[1.5rem] overflow-hidden relative ${customStyles.showShadow ? "shadow-lg" : ""} ${customStyles.showBorder ? "border" : ""}`}
                                    style={{
                                        backgroundColor: cardBg,
                                        borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                    }}
                                >
                                    {/* Featured badge */}
                                    <div
                                        className="absolute top-0 left-0 z-10 px-3 py-1.5 flex items-center gap-2 rounded-br-2xl text-white text-xs font-medium"
                                        style={{ backgroundColor: primary }}
                                    >
                                        <Award className="w-3.5 h-3.5" />
                                        <span>Featured</span>
                                    </div>

                                    {isVideo ? (
                                        <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 mt-0">
                                            <AnimatePresence>
                                                {isPlaying ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 z-20"
                                                    >
                                                        <iframe
                                                            src={`${activeTestimonial.video_url}?autoplay=1`}
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
                                                    </motion.div>
                                                ) : (
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center cursor-pointer pt-6"
                                                        onClick={() => setIsPlaying(true)}
                                                    >
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-xl text-white"
                                                            style={{ backgroundColor: primary }}
                                                        >
                                                            <Play className="w-7 h-7 fill-current ml-0.5" />
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="h-10 w-full"></div>
                                    )}

                                    <div className="p-5">
                                        {!isVideo && <TestimonialStars rating={activeTestimonial.rating} className="mb-3" size="w-4 h-4" color={primary} darkMode={darkMode} />}

                                        <div style={{ color: mainText }} className="mb-4">
                                            <ExpandableContent
                                                content={activeTestimonial.content || ""}
                                                maxLength={150}
                                                darkMode={darkMode}
                                                isVideo={false}
                                                textColor={mainText}
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                            {activeTestimonial.avatar_url ? (
                                                <img
                                                    src={activeTestimonial.avatar_url}
                                                    alt={activeTestimonial.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: `${primary}20` }}
                                                >
                                                    <span className="font-medium" style={{ color: primary }}>{activeTestimonial.name[0]}</span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-sm" style={{ color: authorText }}>{activeTestimonial.name}</p>
                                                <p className="text-xs opacity-70" style={{ color: roleText }}>{activeTestimonial.company || activeTestimonial.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Mobile Navigation */}
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={prev}
                                    className="w-10 h-10 rounded-full border flex items-center justify-center"
                                    style={{
                                        backgroundColor: cardBg,
                                        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                        color: mainText
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="flex gap-1.5">
                                    {displayItems.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setIsPlaying(false);
                                                setActiveIndex(i);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "w-6" : ""
                                                }`}
                                            style={{
                                                backgroundColor: i === activeIndex ? primary : (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
                                            }}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={next}
                                    className="w-10 h-10 rounded-full border flex items-center justify-center"
                                    style={{
                                        backgroundColor: cardBg,
                                        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                        color: mainText
                                    }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsTickerHeroLayout;
