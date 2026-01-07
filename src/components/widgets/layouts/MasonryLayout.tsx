import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { CustomStyles, Testimonial } from "@/utils/widgetUtils";
import { ExpandableContent, TestimonialAvatar, TestimonialStars, subtextClasses } from "@/components/widgets/TestimonialCard";
import { useMemo } from "react";

interface MasonryLayoutProps {
    displayItems: Testimonial[];
    darkMode: boolean;
    customStyles: CustomStyles;
    previewDevice?: "desktop" | "tablet" | "mobile";
}

export const MasonryLayout = ({
    displayItems,
    darkMode,
    customStyles,
    previewDevice = "desktop"
}: MasonryLayoutProps) => {
    const isMobile = previewDevice === "mobile";
    const isTablet = previewDevice === "tablet";

    // Calculate number of columns based on device
    const numCols = isMobile ? 1 : isTablet ? 2 : 3;

    // Distribute items into columns
    const columns = useMemo(() => {
        const cols: Testimonial[][] = Array.from({ length: numCols }, () => []);
        displayItems.forEach((item, i) => {
            cols[i % numCols].push(item);
        });
        return cols;
    }, [displayItems, numCols]);

    return (
        <div className={`
            w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent
            ${isMobile ? "max-h-[600px] px-4" : "max-h-[650px] px-6"}
        `}>
            <div className="flex flex-row gap-4 pb-20 pt-4 items-start">
                {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-3 flex-1 min-w-0">
                        {col.map((t, i) => (
                            <motion.div
                                key={t.id || i}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                                className={`
                                    relative p-6 rounded-[1.5rem] border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                                    w-full
                                `}
                                style={{
                                    backgroundColor: customStyles.backgroundColor || (darkMode ? '#1e293b' : '#ffffff'),
                                    color: customStyles.textColor || (darkMode ? '#ffffff' : '#000000'),
                                    borderColor: customStyles.borderColor || (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                    borderRadius: customStyles.borderRadius,
                                }}
                            >
                                {/* Premium Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <TestimonialAvatar testimonial={t} size="sm" />
                                    <TestimonialStars rating={t.rating} size="w-3.5 h-3.5" />
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <div className="text-sm font-medium leading-relaxed tracking-wide">
                                        <ExpandableContent content={t.content || ""} maxLength={isMobile ? 120 : 180} darkMode={darkMode} />
                                    </div>
                                </div>

                                {/* Premium Footer with Divider */}
                                <div className={`pt-4 border-t border-dashed ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-xs truncate">{t.author_name}</p>
                                            <p className={`text-[10px] mt-0.5 truncate font-medium ${subtextClasses(darkMode)}`}>
                                                {t.author_title || t.author_company || "Verified Customer"}
                                            </p>
                                        </div>
                                        <div className={`text-3xl font-serif italic select-none leading-none h-4 bg-gradient-to-br ${darkMode ? "from-primary/20 via-primary/10 to-transparent" : "from-primary/15 via-primary/8 to-transparent"} bg-clip-text text-transparent drop-shadow-sm`}>"</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

