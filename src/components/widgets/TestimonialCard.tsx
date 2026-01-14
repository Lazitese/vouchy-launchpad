import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Play, Star } from "lucide-react";
import { Testimonial } from "@/utils/widgetUtils";

export const subtextClasses = (darkMode: boolean) => darkMode ? "text-gray-400" : "text-subtext";

interface ExpandableContentProps {
    content: string;
    id?: string;
    maxLength?: number;
    darkMode?: boolean;
    isVideo?: boolean;
    videoUrl?: string | null;
}

export const ExpandableContent = ({ content, maxLength = 140, darkMode = false, isVideo = false, videoUrl }: ExpandableContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Video Preview Mode
    if (isVideo && videoUrl) {
        return (
            <VideoPlayer videoUrl={videoUrl} />
        );
    }

    const effectiveContent = (!content || content.trim() === '') && isVideo
        ? "Watch this video testimonial to hear their experience firsthand."
        : content;

    const needsTruncation = effectiveContent.length > maxLength;
    const displayContent = isExpanded || !needsTruncation ? effectiveContent : effectiveContent.slice(0, maxLength);

    return (
        <div className="space-y-2">
            <p className={`text-sm leading-relaxed transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"} ${isVideo && (!content || content.trim() === '') ? 'italic' : ''}`}>
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

// Helper component to avoid hook rules issues in conditional return
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (

        <div className="relative w-full rounded-xl overflow-hidden bg-black border border-black/5 dark:border-white/5 shadow-inner group aspect-video max-h-[180px]">
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                controls={isPlaying}
                playsInline
                onClick={(e) => e.stopPropagation()}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer"
                    onClick={handlePlay}
                >
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                        <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                    </div>
                </div>
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
                    {t.type === 'video' ? (
                        <Play className={size === 'sm' ? "w-3 h-3 fill-current" : size === 'lg' ? "w-6 h-6 fill-current" : "w-4 h-4 fill-current"} />
                    ) : (
                        <span className={textSizes[size]}>{t.author_name.charAt(0)}</span>
                    )}
                </AvatarFallback>
            </Avatar>
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

