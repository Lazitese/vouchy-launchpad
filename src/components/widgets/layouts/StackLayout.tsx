import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface StackLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    carouselIndex: number;
    nextSlide: () => void;
    prevSlide?: () => void;
    previewDevice?: "desktop" | "tablet" | "mobile";
}

export const StackLayout = ({
    displayItems,
    darkMode,
    customStyles,
    carouselIndex,
    nextSlide,
    prevSlide,
    previewDevice = "desktop"
}: StackLayoutProps) => {
    // Generate a sliding window of 3 items starting from carouselIndex
    const stackItems = Array.from({ length: Math.min(displayItems.length, 3) }).map((_, i) => {
        const idx = (carouselIndex + i) % displayItems.length;
        return displayItems[idx];
    });

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[600px] overflow-hidden">
            {/* Unified 3D Stack View for All Devices */}
            <div className="relative w-full max-w-[340px] md:max-w-lg mx-auto pt-10 pb-20">
                <AnimatePresence initial={false} mode="popLayout">
                    {stackItems.map((t, index) => {
                        const isFront = index === 0;

                        return (
                            <motion.div
                                key={t.id}
                                layout
                                onClick={() => isFront && nextSlide()}
                                drag={isFront ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.7}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = Math.abs(offset.x) * velocity.x;
                                    if (swipe < -500 || offset.x < -100) {
                                        nextSlide();
                                    }
                                }}
                                initial={{ opacity: 0, scale: 0.85, x: -60, y: 20 }}
                                animate={{
                                    scale: 1 - (index * 0.04),
                                    y: index * 16,
                                    zIndex: stackItems.length - index,
                                    opacity: 1 - (index * 0.2),
                                    rotate: isFront ? 0 : (index % 2 === 0 ? 0.8 : -0.8),
                                    x: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.92,
                                    x: 350,
                                    rotate: 15,
                                    y: -30,
                                    zIndex: 10,
                                    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    mass: 0.8
                                }}
                                className={`
                                    ${isFront ? "relative cursor-pointer active:cursor-grabbing" : "absolute inset-x-0 top-0 pointer-events-none"}
                                    p-8 md:p-10 rounded-[2.5rem] border-2 flex flex-col overflow-hidden
                                    ${darkMode
                                        ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-gray-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]"
                                        : "bg-gradient-to-br from-white via-white to-gray-50/30 border-gray-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15),0_8px_16px_-8px_rgba(0,0,0,0.1)]"
                                    }
                                    ${isFront ? "backdrop-blur-xl" : ""}
                                `}
                                style={{
                                    backgroundColor: customStyles.backgroundColor,
                                    color: customStyles.textColor,
                                    borderColor: customStyles.borderColor,
                                    borderRadius: customStyles.borderRadius,
                                    transformOrigin: "top center"
                                }}
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <TestimonialAvatar testimonial={t} size="lg" />
                                    <div className="flex flex-col items-end">
                                        <div className={`text-6xl font-serif italic select-none leading-none h-10 bg-gradient-to-br ${darkMode ? "from-primary/20 via-primary/10 to-transparent" : "from-primary/15 via-primary/8 to-transparent"} bg-clip-text text-transparent drop-shadow-sm`}>"</div>
                                        <TestimonialStars rating={t.rating} size="w-5 h-5" className="mt-4" />
                                    </div>
                                </div>

                                <div className="flex-1 mb-10 text-left min-h-[160px] flex flex-col justify-start">
                                    <div className="text-xl font-bold leading-relaxed tracking-tight">
                                        <ExpandableContent content={t.content || ""} id={t.id} maxLength={220} darkMode={darkMode} />
                                    </div>
                                </div>

                                <div className={`flex items-center justify-between pt-8 border-t border-dashed ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                                    <div className="text-left min-w-0 pr-4">
                                        <p className="text-lg font-black truncate">{t.author_name}</p>
                                        <p className={`text-sm mt-1 truncate ${subtextClasses(darkMode)}`}>
                                            {t.author_title || t.author_company || "Verified Customer"}
                                        </p>
                                    </div>
                                    <Quote className="w-5 h-5 text-primary/20 flex-shrink-0" />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Navigation Controls: Standard Arrows + Dots (Replacing previous text/swipe hint) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 w-full justify-center">
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
    );
};
