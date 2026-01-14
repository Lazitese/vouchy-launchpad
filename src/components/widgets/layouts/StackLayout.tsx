import { motion, AnimatePresence } from "framer-motion";
import { Quote, Play } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface StackLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    carouselIndex: number; // controlled by parent (WidgetPreview)
    nextSlide: () => void;
    prevSlide: () => void;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const StackLayout = ({
    displayItems,
    darkMode,
    customStyles,
    carouselIndex,
    nextSlide,
    prevSlide, // kept for prop compatibility, though usually stack only goes forward
    previewDevice = "desktop",
    onVideoClick
}: StackLayoutProps) => {
    // Current top card
    const activeTestimonial = displayItems[carouselIndex] || displayItems[0];
    const isMobile = previewDevice === "mobile";

    return (
        <div className={`
            w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent
            ${isMobile ? "max-h-[600px] px-4" : "max-h-[650px] px-6"}
        `}>
            <div className="relative w-full flex flex-col items-center justify-center py-10 pb-20 pt-4">
                <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {displayItems.length > 0 &&
                            displayItems.map((t, index) => {
                                // Only render current, next, and maybe previous for stack effect?
                                // Actually stack usually just shows the top one and maybe ones behind it.
                                // Here we just render them all but control z-index and position based on index relative to carouselIndex.

                                // Simplified Stack Logic:
                                // Show current at front.
                                // Show next 1 or 2 behind it.
                                // Hide others.

                                // Calculate "offset" from current index
                                const offset = (index - carouselIndex + displayItems.length) % displayItems.length;

                                // We only want to show 3 cards: offset 0 (active), 1 (behind), 2 (back)
                                if (offset > 2 && offset !== displayItems.length - 1) return null; // Logic to hide unnecessary cards, except maybe smooth exit?

                                // Determine Z-Index
                                const zIndex = displayItems.length - offset;

                                // Determine Scale & Y Position & Opacity
                                const scale = 1 - offset * 0.05;
                                const y = offset * 15; // move down slightly
                                const opacity = 1 - offset * 0.2;

                                return (
                                    <motion.div
                                        key={t.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                        animate={{
                                            opacity: opacity,
                                            scale: scale,
                                            y: y,
                                            zIndex: zIndex,
                                            filter: offset > 0 ? "blur(1px)" : "none",
                                            x: 0
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, y: -100, transition: { duration: 0.3 } }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        drag={offset === 0 ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.7}
                                        onDragEnd={(e, { offset: panOffset, velocity }) => {
                                            const swipe = Math.abs(panOffset.x) * velocity.x;
                                            if (swipe < -500 || panOffset.x < -100) {
                                                nextSlide();
                                            }
                                        }}
                                        onClick={() => {
                                            if (offset === 0) {
                                                nextSlide();
                                            }
                                        }}
                                        className={`
                                            absolute w-full px-8 md:px-0
                                            ${offset === 0 ? 'cursor-pointer' : 'pointer-events-none'}
                                            ${offset === 0 && t.type === 'video' ? 'hover:shadow-xl' : ''}
                                        `}
                                        style={{
                                            maxWidth: isMobile ? "90%" : "100%",
                                        }}
                                    >
                                        <div
                                            className={`
                                                relative p-6 rounded-[2rem] shadow-2xl overflow-hidden
                                                flex flex-col h-[400px] w-full
                                                ${customStyles.showBorder ? "border-2" : "border-0"}
                                            `}
                                            style={{
                                                backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                                                color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                                                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                                borderRadius: customStyles.borderRadius,
                                            }}
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12 pointer-events-none">
                                                <Quote size={80} fill="currentColor" />
                                            </div>

                                            <div className="relative z-10 flex items-start justify-between mb-4">
                                                <TestimonialAvatar testimonial={t} size="lg" />
                                                <TestimonialStars rating={t.rating} size="w-5 h-5" className="mt-2" />
                                            </div>

                                            <div className="relative z-10 flex-1 mb-4 text-left min-h-0 flex flex-col justify-start overflow-hidden">
                                                {t.type === 'video' ? (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div
                                                            className="flex flex-col items-center justify-center gap-3 cursor-pointer group/play"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onVideoClick?.(t.video_url || "");
                                                            }}
                                                        >
                                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover/play:scale-110 ${darkMode ? "bg-white text-black shadow-lg shadow-white/20" : "bg-black text-white shadow-lg shadow-black/20"}`}>
                                                                <Play size={28} className="fill-current ml-1" />
                                                            </div>
                                                            <span className={`text-sm font-medium opacity-80 group-hover/play:opacity-100 ${darkMode ? "text-white" : "text-black"}`}>Watch Video</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-lg md:text-xl font-bold leading-relaxed tracking-tight overflow-y-auto scrollbar-none">
                                                        <ExpandableContent content={t.content || ""} id={t.id} maxLength={140} darkMode={darkMode} isVideo={false} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`relative z-10 flex items-center justify-between pt-4 border-t border-dashed ${darkMode ? "border-gray-800" : "border-gray-100"} shrink-0`}>
                                                <div className="text-left min-w-0 pr-4">
                                                    <p className="text-lg font-black truncate">{t.author_name}</p>
                                                    <p className={`text-sm mt-0.5 truncate ${subtextClasses(darkMode)}`}>
                                                        {t.author_title || t.author_company || "Verified Customer"}
                                                    </p>
                                                </div>
                                                <Quote className="w-5 h-5 text-primary/20 flex-shrink-0" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </AnimatePresence>

                    {/* Navigation Controls: Standard Arrows + Dots */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 w-full justify-center">
                        {/* Prev Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevSlide?.();
                            }}
                            disabled={!prevSlide}
                            className={`p-2 rounded-full transition-all ${!prevSlide
                                ? "opacity-30 cursor-not-allowed"
                                : `hover:bg-primary/10 active:scale-95 ${darkMode ? "hover:text-white" : "hover:text-primary"}`
                                }`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        {/* Progress Dots */}
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                            {displayItems.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-full transition-all duration-300 ${idx === carouselIndex
                                        ? "w-6 h-1.5 bg-primary shadow-sm shadow-primary/30"
                                        : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSlide();
                            }}
                            className={`p-2 rounded-full transition-all hover:bg-primary/10 active:scale-95 ${darkMode ? "hover:text-white" : "hover:text-primary"}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
