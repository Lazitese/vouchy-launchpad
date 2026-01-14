import { motion } from "framer-motion";
import { MessageSquare, CheckCircle, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const RecentActivity = ({ testimonials }: { testimonials: any[] }) => {
    const recentItems = [...testimonials].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5);

    return (
        <div className="organic-card p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-4 text-black">Recent Activity</h3>
            <div className="space-y-4">
                {recentItems.length === 0 ? (
                    <p className="text-gray-400 text-sm">No recent activity</p>
                ) : (
                    recentItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="relative">
                                <Avatar className="w-10 h-10 border border-gray-100">
                                    <AvatarImage src={item.author_avatar_url} />
                                    <AvatarFallback className="bg-gray-100 text-gray-500">
                                        {item.author_name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-white shadow-sm border border-gray-100 rounded-full p-0.5">
                                    {item.type === 'video' ? (
                                        <Smartphone className="w-3 h-3 text-pink-500" />
                                    ) : (
                                        <MessageSquare className="w-3 h-3 text-blue-500" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-black">
                                    <span className="font-bold">{item.author_name}</span> left a review
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    "{item.content || "Video testimonial"}"
                                </p>
                                <p className="text-[10px] text-gray-300 mt-1">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {item.status === 'approved' && (
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" title="Approved" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
