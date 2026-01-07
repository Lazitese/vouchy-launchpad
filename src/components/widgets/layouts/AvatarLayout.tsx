import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface AvatarLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    layout?: "masonry" | "carousel";
    customStyles: CustomStyles;
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
    previewDevice?: "desktop" | "tablet" | "mobile";
}

// --- Card Component ---
const AvatarCard = ({
    t,
    darkMode,
    customStyles,
    previewDevice,
}: {
    t: Testimonial,
    darkMode: boolean,
    customStyles: CustomStyles,
    previewDevice?: "desktop" | "tablet" | "mobile",
}) => {
    // Determine the width class based on the PREVIEW DEVICE
    const widthClass =
        previewDevice === "mobile" ? "min-w-full w-full" :
            previewDevice === "tablet" ? "min-w-[48%] w-[48%]" :
                "min-w-[31%] w-[31%]"; // desktop default
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative w-full pt-16 pb-8 px-8 rounded-[2.5rem] text-center mt-12 mb-6
                flex flex-col shrink-0 transition-all duration-300 hover:-translate-y-2
                ${customStyles.showBorder ? "border-2" : ""}
                ${widthClass} h-[420px] snap-center
            `}
            style={{
                backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                ...(customStyles.borderRadius ? { borderRadius: customStyles.borderRadius } : {}),
            }}
        >
            {/* Profile Image Container - Floating Effect */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className={`p-2 rounded-full shadow-lg ${darkMode ? "bg-gray-900 shadow-primary/10" : "bg-white shadow-primary/10"}`}>
                    {t.author_avatar_url ? (
                        <img
                            src={t.author_avatar_url}
                            alt={t.author_name}
                            className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/30 shadow-lg shadow-primary/10"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary ring-2 ring-primary/30 shadow-lg shadow-primary/10">
                            {t.author_name.charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            {/* Star Rating */}
            <TestimonialStars rating={t.rating} size="w-5 h-5" className="justify-center mb-6" />

            {/* Text Content Area - flex-grow ensures footer stays at bottom */}
            <div className="flex-grow flex flex-col items-center">
                <h3 className={`text-xl font-extrabold mb-4 tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {t.author_title || "Highly Recommended!"}
                </h3>

                <div className={`mb-8 w-full ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <ExpandableContent
                        content={t.content || ""}
                        maxLength={120}
                        darkMode={darkMode}
                    />
                </div>
            </div>

            {/* Footer with Divider */}
            <div className={`w-full flex items-center justify-center border-t border-dashed pt-4 mt-auto ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="text-center w-full">
                    <p className={`font-bold text-sm leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {t.author_name}
                    </p>
                    <p className={`text-xs mt-1 ${subtextClasses(darkMode)}`}>
                        {t.author_company || "@" + t.author_name.replace(/\s+/g, '')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};


export const AvatarLayout = ({
    displayItems = [],
    darkMode = false,
    layout = "masonry",
    customStyles,
    scrollContainerRef: externalRef,
    previewDevice = "desktop"
}: AvatarLayoutProps) => {
    const isMobile = previewDevice === "mobile";
    const localRef = useRef<HTMLDivElement>(null);
    const scrollRef = externalRef || localRef;
    const [activeIndex, setActiveIndex] = useState(0);

    // Calculate actual card width dynamically
    const getCardWidth = () => {
        if (!scrollRef.current) return 364; // fallback
        const container = scrollRef.current;
        const firstCard = container.querySelector('.snap-center') as HTMLElement;
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth;
            const gap = 24; // gap-6 = 24px
            return cardWidth + gap;
        }
        return 364; // fallback (340 + 24)
    };

    // Track scroll to update active index
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const cardWidth = getCardWidth();
            const index = Math.round(scrollLeft / cardWidth);
            setActiveIndex(Math.min(index, displayItems.length - 1));
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [scrollRef, displayItems.length]);

    const scrollTo = (index: number) => {
        if (scrollRef.current) {
            const cardWidth = getCardWidth();
            scrollRef.current.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const handlePrev = () => {
        const newIndex = Math.max(0, activeIndex - 1);
        scrollTo(newIndex);
    };

    const handleNext = () => {
        const newIndex = Math.min(displayItems.length - 1, activeIndex + 1);
        scrollTo(newIndex);
    };

    return (
        <div className="relative group w-full h-full flex flex-col overflow-hidden">
            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex-1 flex flex-row gap-6 overflow-x-auto pb-4 pt-16 px-6 snap-x snap-mandatory scrollbar-none items-start w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {displayItems.map((testimonial, i) => (
                    <AvatarCard
                        key={testimonial.id || i}
                        t={testimonial}
                        darkMode={darkMode}
                        customStyles={customStyles}
                        previewDevice={previewDevice}
                    />
                ))}
            </div>

            {/* Navigation Controls (Spotlight Style) */}
            <div className="flex items-center justify-center gap-4 py-4 shrink-0 z-10 relative">
                <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className={`p-2 rounded-full transition-all hover:bg-primary/10 active:scale-95 ${darkMode ? "hover:text-white" : "hover:text-primary"} ${activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    style={{ color: darkMode ? '#ffffff' : '#000000' }}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'}`}>
                    {displayItems.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={`rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                                ? "w-6 h-1.5 bg-primary shadow-sm shadow-primary/30"
                                : `w-1.5 h-1.5 ${darkMode ? 'bg-gray-700 hover:bg-primary/50' : 'bg-gray-300 hover:bg-primary/50'}`
                                }`}
                            aria-label={`Go to testimonial ${idx + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={activeIndex === displayItems.length - 1}
                    className={`p-2 rounded-full transition-all hover:bg-primary/10 active:scale-95 ${darkMode ? "hover:text-white" : "hover:text-primary"} ${activeIndex === displayItems.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    style={{ color: darkMode ? '#ffffff' : '#000000' }}
                    aria-label="Next testimonial"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};

export default AvatarLayout;
