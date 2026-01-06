import { motion } from "framer-motion";
import { Heart, Link2, Trash2, Share2, Check, X, Play } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Testimonial } from "@/hooks/useTestimonials";

interface TestimonialGridProps {
    testimonials: Testimonial[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDelete: (id: string) => void;
    onShare: (testimonial: Testimonial) => void;
}

export const TestimonialGrid = ({
    testimonials,
    onApprove,
    onReject,
    onDelete,
    onShare,
}: TestimonialGridProps) => {
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (testimonials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 mb-6 rounded-full bg-slate flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary/40" />
                </div>
                <h2 className="text-xl font-bold text-primary mb-2">
                    No testimonials yet
                </h2>
                <p className="text-subtext mb-6 text-center max-w-md">
                    Share your collection link with customers to start receiving testimonials.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {testimonials.map((testimonial) => (
                <motion.div
                    key={testimonial.id}
                    className="p-6 bg-card border border-border/[0.08] rounded-[12px] hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
                    layout
                >
                    {/* Video badge */}
                    {testimonial.type === "video" && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-primary rounded-full shadow-sm">
                            <Play className="w-3 h-3 text-primary-foreground fill-current" />
                            <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-wide">Video</span>
                        </div>
                    )}

                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                                {testimonial.author_avatar_url ? (
                                    <AvatarImage src={testimonial.author_avatar_url} alt={testimonial.author_name} />
                                ) : null}
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                    {testimonial.author_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {testimonial.type === "video" && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                    <Play className="w-2.5 h-2.5 text-primary-foreground fill-current" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-primary">
                                    {testimonial.author_name}
                                </h3>
                                {testimonial.author_title && (
                                    <span className="text-xs text-subtext">
                                        {testimonial.author_title}
                                    </span>
                                )}
                                {testimonial.author_company && (
                                    <>
                                        <span className="text-xs text-subtext/60">at</span>
                                        <span className="text-xs text-subtext">
                                            {testimonial.author_company}
                                        </span>
                                    </>
                                )}
                                <span className="text-xs text-subtext/60">•</span>
                                <span className="text-xs text-subtext/60">
                                    {timeAgo(testimonial.created_at)}
                                </span>
                            </div>
                            {testimonial.rating && (
                                <div className="flex gap-0.5 mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-sm">★</span>
                                    ))}
                                </div>
                            )}
                            {testimonial.type === "video" && testimonial.video_url ? (
                                <video
                                    src={testimonial.video_url}
                                    controls
                                    className="w-full max-w-md rounded-lg mt-2"
                                />
                            ) : (
                                <p className="text-foreground/80 leading-relaxed">
                                    {testimonial.content}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {testimonial.status === "pending" ? (
                                <>
                                    <button
                                        onClick={() => onApprove(testimonial.id)}
                                        className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onReject(testimonial.id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${testimonial.status === "approved"
                                            ? "bg-green-500/10 text-green-600"
                                            : "bg-red-500/10 text-red-600"
                                        }`}
                                >
                                    {testimonial.status}
                                </span>
                            )}
                            <button
                                className="p-2 rounded-lg hover:bg-slate transition-colors"
                                onClick={() => onShare(testimonial)}
                                title="Share testimonial"
                            >
                                <Share2 className="w-4 h-4 text-subtext" />
                            </button>
                            <button
                                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                onClick={() => onDelete(testimonial.id)}
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4 text-subtext hover:text-red-500" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
