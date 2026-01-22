import { useState } from "react";
import { motion } from "framer-motion";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";
import { Play, ChevronDown } from "lucide-react";

interface PolaroidStackLayoutProps {
    displayItems: Testimonial[];
    darkMode?: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
    onVideoClick?: (videoUrl: string) => void;
}

export const PolaroidStackLayout = ({
    displayItems,
    darkMode = false,
    customStyles,
    previewDevice = "desktop",
    onVideoClick
}: PolaroidStackLayoutProps) => {
    const [showAll, setShowAll] = useState(false);
    const isMobile = previewDevice === "mobile";

    // Helper for colors
    const cardBg = customStyles.cardBackgroundColor || (darkMode ? '#0f172a' : '#ffffff');
    const mainText = customStyles.contentColor || customStyles.textColor || (darkMode ? '#ffffff' : '#000000');
    const authorText = customStyles.authorColor || customStyles.textColor || (darkMode ? '#ffffff' : '#111827');
    const roleText = customStyles.roleColor || (darkMode ? '#9ca3af' : '#6b7280');
    const primary = customStyles.primaryColor || '#10b981';

    const visibleTestimonials = showAll ? displayItems : displayItems.slice(0, 6);

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent p-4">
            <div className={`grid gap-8 ${previewDevice === "mobile" ? "grid-cols-1" : previewDevice === "tablet" ? "grid-cols-2" : "grid-cols-4"}`}>
                {visibleTestimonials.map((testimonial, index) => {
                    const isEven = index % 2 === 0;
                    const rotation = (index * 7) % 3 - 1.5; // Subtle random rotation

                    return (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 50, rotate: rotation * 2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                            whileHover={{
                                scale: 1.02,
                                rotate: 0,
                                y: -10,
                                zIndex: 10,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative"
                        >
                            <div
                                className={`relative p-3 pb-12 rounded-[0.5rem] overflow-hidden transition-all duration-300
                                    ${customStyles.showShadow ? "shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.4)]" : "shadow-xl"}`}
                                style={{
                                    backgroundColor: cardBg,
                                    border: customStyles.showBorder ? `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none',
                                }}
                            >
                                {/* Premium Glass Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Image or Video Section */}
                                <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800 mb-6 overflow-hidden shadow-inner">
                                    {(testimonial.video_url || testimonial.avatar_url) ? (
                                        <>
                                            {testimonial.video_url ? (
                                                <div className="relative w-full h-full group/video">
                                                    <img
                                                        src={testimonial.avatar_url || 'https://via.placeholder.com/400x300?text=Video'}
                                                        alt={testimonial.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors flex items-center justify-center">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onVideoClick?.(testimonial.video_url!);
                                                            }}
                                                            className="w-14 h-14 rounded-full backdrop-blur-md bg-white/30 border border-white/50 flex items-center justify-center text-white shadow-xl transition-all hover:bg-white hover:text-black hover:border-white"
                                                            style={{ color: '#ffffff' }}
                                                        >
                                                            <Play className="w-6 h-6 ml-1 fill-current" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={testimonial.avatar_url!}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    style={{ filter: 'contrast(1.1) saturate(1.1)' }} // Enhance image slightly
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center text-6xl font-serif font-bold italic opacity-20"
                                            style={{
                                                color: primary,
                                                background: `radial-gradient(circle at center, ${primary}10, transparent)`
                                            }}
                                        >
                                            {testimonial.name[0]}
                                        </div>
                                    )}

                                    {/* Star Rating Badge - Floating on image */}
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded shadow-lg flex gap-1">
                                        <TestimonialStars
                                            rating={testimonial.rating}
                                            darkMode={true} // Always dark mode for image overlay
                                            size="w-3 h-3"
                                            color="#fbbf24" // Gold color for luxury feel
                                        />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="px-2 space-y-4">
                                    <div className="text-center">
                                        <div style={{ color: mainText }} className="font-serif italic text-sm leading-relaxed opacity-90">
                                            <ExpandableContent
                                                content={`"${testimonial.content}"` || ""}
                                                maxLength={120}
                                                darkMode={darkMode}
                                                isVideo={false}
                                                textColor={mainText}
                                            />
                                        </div>
                                    </div>

                                    {/* Luxury Divider */}
                                    <div className="flex items-center justify-center gap-2 opacity-30">
                                        <div className="h-[1px] w-8 bg-current" style={{ backgroundColor: mainText }} />
                                        <div className="w-1 h-1 rounded-full border border-current" style={{ borderColor: mainText }} />
                                        <div className="h-[1px] w-8 bg-current" style={{ backgroundColor: mainText }} />
                                    </div>

                                    <div className="text-center">
                                        <h4 className="font-medium text-base tracking-wide" style={{ color: authorText }}>
                                            {testimonial.name}
                                        </h4>
                                        <p className={`text-xs uppercase tracking-widest mt-1 opacity-60 ${subtextClasses(darkMode)}`} style={{ color: roleText }}>
                                            {testimonial.company || "Verified Customer"}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Brand Accent */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-1.5 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"
                                    style={{ backgroundColor: primary }}
                                />
                            </div>

                            {/* Back Stack Effect (adds depth) */}
                            <div
                                className="absolute inset-0 rounded-[0.5rem] -z-10 rotate-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 origin-center shadow-lg"
                                style={{
                                    backgroundColor: darkMode ? '#334155' : '#f1f5f9',
                                    transform: `rotate(${rotation * -2}deg) scale(0.98)`,
                                }}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* See More Button */}
            {displayItems.length > 6 && !showAll && (
                <div className="flex justify-center pb-8 pt-8">
                    <button
                        onClick={() => setShowAll(true)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg border backdrop-blur-sm`}
                        style={{
                            backgroundColor: cardBg,
                            color: mainText,
                            borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                        }}
                    >
                        See More
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PolaroidStackLayout;
