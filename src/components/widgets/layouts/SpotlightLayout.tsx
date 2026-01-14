import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface SpotlightLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    activeStyle: string; // for the badge condition logic
    customStyles: CustomStyles;
    carouselIndex: number;
    prevSlide: () => void;
    nextSlide: () => void;
    setCarouselIndex: (index: number) => void;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const SpotlightLayout = ({
    displayItems,
    darkMode,
    activeStyle,
    customStyles,
    carouselIndex,
    prevSlide,
    nextSlide,
    setCarouselIndex,
    previewDevice = "desktop",
    onVideoClick
}: SpotlightLayoutProps) => {
    const isMobile = previewDevice === "mobile";
    const current = displayItems[carouselIndex] || displayItems[0];

    return (
        <div className={`
            w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent
            ${isMobile ? "max-h-[600px] px-4" : "max-h-[650px] px-6"}
        `}>
            <div className="relative max-w-2xl mx-auto pb-20 pt-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current?.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.4 }}
                        className={`
          relative z-10 p-6 md:p-8 rounded-2xl md:rounded-3xl text-center overflow-hidden
          h-[400px] flex flex-col items-center
          ${customStyles.showBorder ? "border" : "border-0"}
          ${customStyles.showShadow ? (darkMode ? "" : "shadow-2xl shadow-primary/5") : ""}
        `}
                        style={{
                            backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                            color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                            borderRadius: customStyles.borderRadius,
                            boxShadow: customStyles.showShadow ? undefined : "none",
                        }}
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                            <Quote className="w-32 h-32" />
                        </div>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative mx-auto w-fit mb-4 flex justify-center items-center"
                        >
                            <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full"></div>
                            <TestimonialAvatar testimonial={current} size="lg" />
                            {activeStyle === "spotlight" && (
                                <motion.div
                                    className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-white dark:border-gray-900"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {current.rating}.0
                                </motion.div>
                            )}
                        </motion.div>

                        <TestimonialStars rating={current?.rating} size="w-6 h-6" className="justify-center mb-6" />

                        <motion.div
                            className="text-lg md:text-xl font-medium leading-relaxed mb-6 max-w-lg mx-auto flex items-center justify-center min-h-[120px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {current?.type === 'video' ? (
                                <div
                                    className="flex flex-col items-center justify-center gap-3 cursor-pointer group/play"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onVideoClick?.(current.video_url || "");
                                    }}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover/play:scale-110 ${darkMode ? "bg-white text-black shadow-lg shadow-white/20" : "bg-black text-white shadow-lg shadow-black/20"}`}>
                                        <Play size={32} className="fill-current ml-1" />
                                    </div>
                                    <span className={`text-sm font-medium opacity-80 group-hover/play:opacity-100 ${darkMode ? "text-white" : "text-black"}`}>Watch Video</span>
                                </div>
                            ) : (
                                <ExpandableContent content={current?.content || ""} id={current?.id || ""} maxLength={180} darkMode={darkMode} isVideo={false} />
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full"
                        >
                            <p className="text-base font-bold truncate px-4">{current?.author_name}</p>
                            {(current?.author_title || current?.author_company) && (
                                <p className={`text-sm mt-1 truncate px-4 ${subtextClasses(darkMode)}`}>
                                    {current.author_title}
                                    {current.author_title && current.author_company && " @ "}
                                    <span className="opacity-80">{current.author_company}</span>
                                </p>
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons for Spotlight (Unified Premium Style) */}
                {displayItems.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className={`p-2 rounded-full transition-all hover:bg-primary/10 active:scale-95 ${darkMode ? "hover:text-white" : "hover:text-primary"}`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                            {displayItems.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCarouselIndex(i)}
                                    className={`rounded-full transition-all duration-300 ${i === carouselIndex
                                        ? "w-6 h-1.5 bg-primary shadow-sm shadow-primary/30"
                                        : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-primary/50"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className={`p-2 rounded-full transition-all hover:bg-primary/10 active:scale-95 ${darkMode ? "hover:text-white" : "hover:text-primary"}`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
