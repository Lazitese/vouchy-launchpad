import { motion } from "framer-motion";
import { Play, Star, Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface BentoLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const BentoLayout = ({ displayItems, darkMode, customStyles, previewDevice = "desktop", onVideoClick }: BentoLayoutProps) => {
    const isMobile = previewDevice === "mobile";

    // Split items for mobile marquee logic
    const half = Math.ceil(displayItems.length / 2);
    const row1 = displayItems.slice(0, half);
    const row2 = displayItems.slice(half);

    // Standard Card Renderer to keep code DRY
    const BentoCard = ({ t, i, isLarge }: { t: Testimonial, i: number, isLarge?: boolean }) => {
        const spanClass = isMobile ? "w-[280px] shrink-0 min-h-[220px]" : (() => {
            switch (i) {
                case 0: return "md:col-span-2 md:row-span-2";
                case 3: return "md:col-span-1 md:row-span-2";
                default: return "md:col-span-1 md:row-span-1";
            }
        })();

        return (
            <motion.div
                initial={isMobile ? {} : { opacity: 0, scale: 0.9 }}
                animate={isMobile ? {} : { opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`
                    relative rounded-2xl p-5 overflow-hidden transition-all duration-300 group flex flex-col
                    ${spanClass}
                    ${customStyles.showBorder ? "border" : "border-0"}
                    ${customStyles.showShadow ? "shadow-sm shadow-black/5" : ""}
                `}
                style={{
                    backgroundColor: customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                    color: customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000'), // Main text content color
                    borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    borderRadius: customStyles.borderRadius,
                    height: isMobile ? "auto" : undefined
                }}
            >
                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 pointer-events-none">
                    <Quote size={60} fill="currentColor" />
                </div>

                <div className="relative h-full flex flex-col z-10 w-full">
                    {/* Header: Avatar */}
                    <div className="flex items-start justify-between mb-4">
                        <TestimonialAvatar testimonial={t} size={isLarge ? "lg" : "sm"} />
                    </div>

                    {/* Content Section: Stars & Text */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <TestimonialStars darkMode={darkMode} rating={t.rating} size="w-3.5 h-3.5" className="mb-2" color={customStyles.primaryColor} />

                        {isLarge && t.type === 'video' ? (
                            <div className="flex-1 w-full min-h-[200px] rounded-xl overflow-hidden bg-black border border-black/5 dark:border-white/5 shadow-inner group relative">
                                <video
                                    src={t.video_url || ""}
                                    className="w-full h-full object-contain"
                                    controls
                                    playsInline
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        ) : (
                            <div
                                className={`font-medium leading-relaxed ${isLarge ? "text-base md:text-lg" : "text-[13px] md:text-sm"}`}
                                style={{ color: customStyles.contentColor || customStyles.textColor || (darkMode ? "#ffffff" : "#000000") }}
                            >
                                <ExpandableContent
                                    content={t.content || ""}
                                    maxLength={isLarge ? 250 : 100}
                                    darkMode={darkMode}
                                    isVideo={t.type === 'video'}
                                    videoUrl={t.video_url}
                                    textColor={customStyles.contentColor || customStyles.textColor || (darkMode ? "#ffffff" : "#000000")}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer: Author Info */}
                    <div className="mt-4 pt-3 border-t border-dashed border-border/20 flex items-center justify-between">
                        <div className="min-w-0">
                            <p
                                className="font-bold text-[11px] md:text-sm truncate"
                                style={{ color: customStyles.authorColor || customStyles.textColor || (darkMode ? "#ffffff" : "#000000") }}
                            >
                                {t.name}
                            </p>
                            <p
                                className={`text-[10px] truncate ${subtextClasses(darkMode)}`}
                                style={{ color: customStyles.roleColor || (darkMode ? "#9ca3af" : "#6b7280") }}
                            >
                                {t.title || "@" + t.name.replace(/\s/g, '').toLowerCase()}
                            </p>
                        </div>
                        <Quote className="w-3 h-3 text-primary/40 flex-shrink-0" />
                    </div>
                </div>
            </motion.div>
        );
    };

    // CSS for the marquee animation (Mobile Only)
    const marqueeStyle = `
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
            animation: marquee-reverse 40s linear infinite;
        }
        .marquee-container:hover .animate-marquee,
        .marquee-container:hover .animate-marquee-reverse {
            animation-play-state: paused;
        }
    `;

    // Mobile View: Two-Row Marquee
    if (isMobile) {
        return (
            <div className="flex flex-col gap-4 py-4 overflow-hidden w-full marquee-container group">
                <style>{marqueeStyle}</style>

                {/* Row 1: Scrolling Left (Standard) */}
                <div className="flex w-full overflow-hidden">
                    <div className="flex gap-4 animate-marquee w-max">
                        {/* Duplicate content x4 for smooth loop */}
                        {[...row1, ...row1, ...row1, ...row1, ...row1].map((t, i) => (
                            <BentoCard key={`r1-${t.id}-${i}`} t={t} i={i} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Scrolling Right (Reverse) */}
                <div className="flex w-full overflow-hidden">
                    <div className="flex gap-4 animate-marquee-reverse w-max">
                        {[...row2, ...row2, ...row2, ...row2, ...row2].map((t, i) => (
                            <BentoCard key={`r2-${t.id}-${i}`} t={t} i={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Desktop/Tablet View: Standard Bento Grid
    return (
        <div className={`
            w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent
            ${isMobile ? "max-h-[600px] px-4" : "max-h-[650px] px-6"}
        `}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr pb-20 pt-4">
                {displayItems.map((t, i) => (
                    <BentoCard key={t.id} t={t} i={i} isLarge={i === 0} />
                ))}
            </div>
        </div>
    );
};
