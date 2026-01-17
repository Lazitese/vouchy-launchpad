import { motion } from "framer-motion";
import { MessageSquare, CheckCircle, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const RecentActivity = ({ testimonials }: { testimonials: any[] }) => {
    const recentItems = [...testimonials].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5);

    return (
        <div className="organic-card p-6">
            <h3 className="font-bold text-lg mb-6 text-zinc-900">Recent Activity</h3>
            <div className="space-y-4">
                {recentItems.length === 0 ? (
                    <p className="text-zinc-400 text-sm italic">No recent activity</p>
                ) : (
                    recentItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 border border-transparent hover:border-zinc-100 transition-all group"
                        >
                            <div className="relative">
                                <Avatar className="w-10 h-10 border border-zinc-100 ring-2 ring-white">
                                    <AvatarImage src={item.avatar_url} />
                                    <AvatarFallback className="bg-[#14873e] text-white font-bold">
                                        {item.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-white shadow-sm border border-zinc-100 rounded-full p-0.5">
                                    {item.type === 'video' ? (
                                        <Smartphone className="w-3 h-3 text-zinc-900" strokeWidth={2.5} />
                                    ) : (
                                        <MessageSquare className="w-3 h-3 text-zinc-900" strokeWidth={2.5} />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-900">
                                    <span className="font-bold">{item.name}</span> left a review
                                </p>
                                <p className="text-xs text-zinc-500 truncate mt-0.5">
                                    "{item.content || "Video testimonial"}"
                                </p>
                                <p className="text-[10px] text-zinc-400 mt-1 font-mono">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {item.status === 'approved' && (
                                <div className="flex items-center gap-1 lime-card px-2 py-1 items-center justify-center">
                                    <CheckCircle className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Approved</span>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
