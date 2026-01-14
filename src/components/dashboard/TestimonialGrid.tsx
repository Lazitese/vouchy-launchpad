import { motion } from "framer-motion";
import { Heart, Link2, Trash2, Share2, Check, X, Play } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Testimonial } from "@/hooks/useTestimonials";
import { VideoModal } from "@/components/widgets/VideoModal";
import { useState } from "react";

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
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((testimonial) => (
                <motion.div
                    key={testimonial.id}
                    className="organic-card p-6 relative overflow-hidden group mb-6 break-inside-avoid"
                    layout
                >


                    <div className="flex flex-col gap-4">
                        {/* Header: Avatar + Meta */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 ring-2 ring-gray-50 border border-gray-100">
                                    {testimonial.author_avatar_url ? (
                                        <AvatarImage src={testimonial.author_avatar_url} alt={testimonial.author_name} />
                                    ) : null}
                                    <AvatarFallback className="bg-gray-100 text-gray-500 font-bold text-sm">
                                        {testimonial.author_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-black text-sm leading-tight">
                                        {testimonial.author_name}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {testimonial.author_title || "Verified Customer"}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            {testimonial.rating && (
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-xs ${i < testimonial.rating ? 'text-black' : 'text-gray-200'}`}>★</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="text-sm text-gray-600 leading-relaxed">
                            {testimonial.type === "video" && testimonial.video_url ? (
                                <div
                                    className="relative w-full h-32 rounded-xl bg-black flex items-center justify-center cursor-pointer group/play overflow-hidden border border-black/5 shadow-inner"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedVideo(testimonial.video_url);
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20" />
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/play:scale-110">
                                        <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                                    </div>
                                    <span className="absolute bottom-3 text-[10px] font-bold text-white/50 uppercase tracking-widest group-hover/play:text-white/80 transition-colors">
                                        Watch Video
                                    </span>
                                </div>
                            ) : (
                                <p className="italic">
                                    "{testimonial.content}"
                                </p>
                            )}
                        </div>

                        {/* Footer: Date & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                {timeAgo(testimonial.created_at)}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {testimonial.status === "pending" ? (
                                    <>
                                        <button
                                            onClick={() => onApprove(testimonial.id)}
                                            className="w-8 h-8 rounded-full bg-lime-100 text-lime-700 hover:bg-lime-200 flex items-center justify-center transition-colors"
                                            title="Approve"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => onReject(testimonial.id)}
                                            className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                                            title="Reject"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${testimonial.status === 'approved' ? 'bg-lime-100 text-lime-800' : 'bg-red-50 text-red-600'}`}>
                                        {testimonial.status}
                                    </div>
                                )}

                                <div className="w-px h-4 bg-gray-200 mx-1" />

                                <button
                                    className="w-8 h-8 rounded-full hover:bg-gray-50 text-gray-400 hover:text-black flex items-center justify-center transition-colors"
                                    onClick={() => onDelete(testimonial.id)}
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrl={selectedVideo || ""}
            />
        </div>
    );
};
