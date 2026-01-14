import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface MarqueeLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const MarqueeLayout = ({
    displayItems,
    darkMode,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: MarqueeLayoutProps) => {
    const isMobile = previewDevice === "mobile";

    // Split items for dual-row view (always 2 rows as requested)
    const half = Math.ceil(displayItems.length / 2);
    // Ensure we have enough items for a loop
    const row1 = displayItems.length > 0 ? displayItems.slice(0, half) : [];
    const row2 = displayItems.length > 0 ? displayItems.slice(half) : [];

    // Failsafe if only 1 item or very few
    const finalRow1 = row1.length === 0 ? displayItems : row1;
    const finalRow2 = row2.length === 0 ? displayItems : row2;

    // Reusable Card Component
    const MarqueeCard = ({ t, i }: { t: Testimonial, i: number }) => (
        <div
            className={`
                flex-shrink-0 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]
                w-[280px] md:w-[350px]
                ${customStyles.showBorder ? "border" : "border-0"}
                ${customStyles.showShadow ? "shadow-lg shadow-black/5" : ""}
            `}
            style={{
                backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                borderRadius: customStyles.borderRadius,
            }}
        >
            <div className="flex flex-col h-full">
                <TestimonialStars rating={t.rating} size="w-3.5 h-3.5" className="mb-4" />

                <div className="mb-6 flex-1">
                    <ExpandableContent
                        content={t.content || ""}
                        id={`${t.id}-${i}`}
                        maxLength={isMobile ? 100 : 150}
                        darkMode={darkMode}
                        isVideo={t.type === 'video'}
                        videoUrl={t.video_url}
                    />
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TestimonialAvatar testimonial={t} size="sm" />
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{t.author_name}</p>
                            <p className={`text-xs truncate ${subtextClasses(darkMode)}`}>{t.author_company || "Verified Customer"}</p>
                        </div>
                    </div>
                    <Quote className="w-4 h-4 text-primary/20" />
                </div>
            </div>
        </div>
    );

    // CSS for the marquee animation
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

    return (
        <div className="relative overflow-hidden py-10 -mx-6 marquee-container group">
            <style>{marqueeStyle}</style>

            {/* Gradient Masks */}
            {/* Gradient Masks - Dynamic colors to match custom background */}
            <div
                className="absolute inset-y-0 left-0 w-24 md:w-32 z-20 pointer-events-none"
                style={{
                    background: `linear-gradient(to right, ${customStyles.backgroundColor || (darkMode ? '#0f172a' : '#ffffff')}, transparent)`
                }}
            />
            <div
                className="absolute inset-y-0 right-0 w-24 md:w-32 z-20 pointer-events-none"
                style={{
                    background: `linear-gradient(to left, ${customStyles.backgroundColor || (darkMode ? '#0f172a' : '#ffffff')}, transparent)`
                }}
            />

            <div className="flex flex-col gap-6">
                {/* Row 1: Left to Right (Actually standard marquee moves content left, so items appear from right) */}
                {/* Wait, standard marquee: content moves LEFT. (transform x 0 to -50%). Matches normal reading direction sort of. */}
                {/* User previously had "animate={{ x: [-1200, 0] }}" which is moving RIGHT (Left to Right). */}
                {/* Let's keep one moving Left, one moving Right. */}

                {/* Row 1: Left Moving (Standard) */}
                <div className="flex overflow-hidden w-full">
                    <div className="flex gap-6 animate-marquee w-max pl-6">
                        {/* Duplicate content times 4 to ensure smooth loop on large screens */}
                        {[...finalRow1, ...finalRow1, ...finalRow1, ...finalRow1].map((t, i) => (
                            <MarqueeCard key={`r1-${t.id}-${i}`} t={t} i={i} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right Moving (Reverse) */}
                {/* Logic: Transform -50% to 0. */}
                <div className="flex overflow-hidden w-full">
                    <div className="flex gap-6 animate-marquee-reverse w-max pl-6">
                        {[...finalRow2, ...finalRow2, ...finalRow2, ...finalRow2].map((t, i) => (
                            <MarqueeCard key={`r2-${t.id}-${i}`} t={t} i={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};