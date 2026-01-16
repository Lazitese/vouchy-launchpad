import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";

interface ParallaxScrollLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const ParallaxScrollLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: ParallaxScrollLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobile = previewDevice === "mobile";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#1e293b' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent p-4"
        >
            <div className={`grid gap-8 pb-20 pt-4 ${isMobile ? "grid-cols-1 gap-y-12" : "grid-cols-2 gap-x-8 gap-y-12"}`}>
                {displayItems.map((testimonial, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <ParallaxCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            index={index}
                            isEven={isEven}
                            isMobile={isMobile}
                            darkMode={darkMode}
                            customStyles={customStyles}
                            cardBg={cardBg}
                            mainText={mainText}
                            authorText={authorText}
                            roleText={roleText}
                            primary={primary}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const ParallaxCard = ({
    testimonial,
    index,
    isEven,
    isMobile,
    darkMode,
    customStyles,
    cardBg,
    mainText,
    authorText,
    roleText,
    primary
}: {
    testimonial: Testimonial;
    index: number;
    isEven: boolean;
    isMobile: boolean;
    darkMode: boolean;
    customStyles: CustomStyles;
    cardBg: string;
    mainText: string;
    authorText: string;
    roleText: string;
    primary: string;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Enabled parallax on mobile with subtle range (±20px) to maintain the effect
    // Increased offset to ±40px on desktop for more dramatic feel
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        isMobile ? [isEven ? 20 : -20, isEven ? -20 : 20] : [isEven ? 40 : -40, isEven ? -40 : 40]
    );

    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={cardRef}
            style={{
                y,
                opacity,
                backgroundColor: cardBg,
                borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`relative rounded-[1.5rem] overflow-hidden flex flex-col h-full
                ${customStyles.showBorder ? "border" : "border border-transparent"} 
                ${customStyles.showShadow ? "shadow-lg hover:shadow-xl" : "shadow-md"}
                transition-shadow duration-300`}
        >
            {/* Gradient accent bar */}
            <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: primary }}
            />

            <div className="p-6 md:p-8 flex-1 flex flex-col">
                {/* Header with avatar and rating */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {testimonial.avatar_url ? (
                            <img
                                src={testimonial.avatar_url}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-offset-transparent"
                                style={{ '--tw-ring-color': `${primary}30` } as React.CSSProperties}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                            />
                        ) : (
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                                style={{
                                    backgroundColor: `${primary}15`,
                                    color: primary
                                }}
                            >
                                {testimonial.name[0]}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-base leading-tight" style={{ color: authorText }}>
                                {testimonial.name}
                            </p>
                            <p className={`text-xs mt-1 ${subtextClasses(darkMode)}`} style={{ color: roleText }}>
                                {testimonial.company || "Verified Customer"}
                            </p>
                        </div>
                    </div>
                    <TestimonialStars
                        rating={testimonial.rating}
                        darkMode={darkMode}
                        size="w-4 h-4"
                        color={primary}
                    />
                </div>

                {/* Content */}
                <div style={{ color: mainText }} className="text-sm leading-relaxed flex-1">
                    <ExpandableContent
                        content={testimonial.content || ""}
                        maxLength={200}
                        darkMode={darkMode}
                        isVideo={false}
                        textColor={mainText}
                    />
                </div>
            </div>

            {/* Decorative corner accent */}
            <div
                className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none"
                style={{
                    background: `radial-gradient(circle at bottom right, ${primary}, transparent 70%)`
                }}
            />
        </motion.div>
    );
};

export default ParallaxScrollLayout;
