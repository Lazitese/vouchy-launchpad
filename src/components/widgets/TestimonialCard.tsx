import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Play, Star } from "lucide-react";
import { Testimonial } from "@/utils/widgetUtils";

export const subtextClasses = (darkMode: boolean) => darkMode ? "text-gray-400" : "text-subtext";

interface ExpandableContentProps {
    content: string;
    id?: string;
    maxLength?: number;
    darkMode?: boolean;
}

export const ExpandableContent = ({ content, maxLength = 140, darkMode = false }: ExpandableContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const needsTruncation = content.length > maxLength;
    const displayContent = isExpanded || !needsTruncation ? content : content.slice(0, maxLength);

    return (
        <div className="space-y-2">
            <p className={`text-sm leading-relaxed transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                "{displayContent}{!isExpanded && needsTruncation ? "..." : ""}"
            </p>
            {needsTruncation && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${darkMode
                        ? "text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
                        : "text-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10"
                        } hover:scale-105 active:scale-95`}
                >
                    {isExpanded ? "See less ↑" : "See more ↓"}
                </button>
            )}
        </div>
    );
};

interface TestimonialAvatarProps {
    testimonial: Testimonial;
    size?: "sm" | "md" | "lg";
}

export const TestimonialAvatar = ({ testimonial: t, size = "md" }: TestimonialAvatarProps) => {
    const sizeClasses = {
        sm: "w-7 h-7",
        md: "w-10 h-10",
        lg: "w-16 h-16"
    };
    const textSizes = {
        sm: "text-[10px]",
        md: "text-sm",
        lg: "text-xl"
    };

    return (
        <div className="relative">
            <Avatar className={`${sizeClasses[size]} ring-2 ring-primary/30 shadow-lg shadow-primary/10`}>
                {t.author_avatar_url ? (
                    <AvatarImage src={t.author_avatar_url} alt={t.author_name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    <span className={textSizes[size]}>{t.author_name.charAt(0)}</span>
                </AvatarFallback>
            </Avatar>
            {t.type === "video" && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <Play className="w-2 h-2 text-primary-foreground fill-current" />
                </div>
            )}
        </div>
    );
};

interface TestimonialStarsProps {
    rating?: number;
    className?: string;
    size?: string;
}

export const TestimonialStars = ({ rating = 5, className = "", size = "w-4 h-4" }: TestimonialStarsProps) => {
    // Ensure rating is at least 1 and at most 5
    const finalRating = Math.max(1, Math.min(5, rating || 5));

    return (
        <div className={`flex gap-0.5 shrink-0 items-center ${className}`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`${size} transition-all ${i < finalRating ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-gray-200 dark:text-gray-800"}`}
                />
            ))}
        </div>
    );
};

