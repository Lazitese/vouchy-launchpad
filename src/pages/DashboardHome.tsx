
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Copy, Play, MessageSquare, ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { VideoModal } from "@/components/widgets/VideoModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface DashboardHomeProps {
    user: any;
    spaces: any[];
    testimonials: any[];
    setCreateDialogOpen: (open: boolean) => void;
    copyCollectionLink: (slug: string) => void;
    setActiveView: (view: any) => void;
    onManageSpace: (spaceId: string) => void;
    updateSpace: (id: string, updates: any) => Promise<any>;
    deleteSpace: (id: string) => Promise<any>;
}

export const DashboardHome = ({
    user,
    spaces,
    testimonials,
    setCreateDialogOpen,
    copyCollectionLink,
    setActiveView,
    onManageSpace,
    updateSpace,
    deleteSpace
}: DashboardHomeProps) => {
    const { toast } = useToast();
    const [filter, setFilter] = useState("All");
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Filter Logic
    const filteredTestimonials = useMemo(() => {
        switch (filter) {
            case "Video": return testimonials.filter(t => t.type === 'video');
            case "Text": return testimonials.filter(t => t.type === 'text');
            case "High Rating": return testimonials.filter(t => t.rating >= 4);
            case "Low Rating": return testimonials.filter(t => t.rating < 4);
            default: return testimonials;
        }
    }, [testimonials, filter]);

    // Real Analytics Calculations
    const analyticsData = useMemo(() => {
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(now.getDate() - (6 - i));
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        // 1. Chart Data (Daily Volume)
        const dailyCounts = last7Days.map(date => ({
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            date,
            value: testimonials.filter(t => t.created_at?.startsWith(date)).length
        }));

        // 2. Aggregate Stats
        const totalRating = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0);
        const avgRating = totalRating > 0 ? (totalRating / testimonials.length).toFixed(1) : "0.0";
        const videoCount = testimonials.filter(t => t.type === 'video').length;
        const videoPercentage = testimonials.length > 0 ? Math.round((videoCount / testimonials.length) * 100) : 0;

        return { dailyCounts, avgRating, videoPercentage };
    }, [testimonials]);

    return (
        <div className="space-y-12">

            {/* Top Section: Analytics & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Curve Chart */}
                <div className="lg:col-span-2 organic-card min-h-[320px] p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-start justify-between z-10 relative">
                        <div>
                            <h3 className="text-2xl font-light text-zinc-900 mb-1">Impact Overview</h3>
                            <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                                <TrendingUp className="w-4 h-4 text-[#ccf381]-600" />
                                <span>+12% vs last week</span>
                            </div>
                        </div>
                        <div className="flex bg-zinc-100/50 p-1 rounded-xl backdrop-blur-sm">
                            {['7D', '30D', '3M'].map((range, i) => (
                                <button
                                    key={range}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${i === 0 ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-black'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-48 w-[110%] -ml-4 z-10 relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.dailyCounts}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14873e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#14873e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={{ stroke: '#14873e', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#14873e] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl flex flex-col gap-1">
                                                    <span className="opacity-70 font-normal">{label}</span>
                                                    <span>{payload[0].value} Reviews</span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#14873e"
                                    strokeWidth={2.5}
                                    fill="url(#colorValue)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Stats Column */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                    <div className="organic-card p-6 flex flex-col justify-center relative overflow-hidden group hover:border-[#ccf381]/50 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <ExternalLink className="w-16 h-16" />
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">{analyticsData.avgRating}</p>
                        <p className="text-sm text-zinc-500 font-medium">Average Rating</p>
                    </div>
                    <div className="organic-card p-6 flex flex-col justify-center relative overflow-hidden group hover:border-black/20 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <MessageSquare className="w-16 h-16" />
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">{analyticsData.videoPercentage}%</p>
                        <p className="text-sm text-zinc-500 font-medium">Video Response Rate</p>
                    </div>
                </div>
            </div>

            {/* Main Section: New Leads (Testimonials) */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-2xl font-light text-zinc-900">Latest Feedback</h3>
                        <span className="text-sm font-medium text-zinc-400 border-b border-zinc-200 pb-0.5">{testimonials.length} total</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {['All', 'Video', 'Text', 'High Rating'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === f ? 'bg-[#14873e] text-white shadow-lg shadow-[#14873e]/20' : 'bg-white text-zinc-400 hover:text-black hover:shadow-sm'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Horizontal Scroll List of Cards */}
                <div
                    id="testimonials-container"
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-10 -mx-4 px-4 md:px-6"
                >
                    {filteredTestimonials.length === 0 ? (
                        <div className="w-full h-48 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 bg-white/50">
                            <p className="mb-4 font-medium text-sm">No reviews match your filter</p>
                            <Button variant="outline" onClick={() => setFilter("All")} className="rounded-full h-8 text-xs">Clear Filters</Button>
                        </div>
                    ) : (
                        filteredTestimonials.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="organic-card min-w-[320px] max-w-[320px] h-[340px] p-6 flex flex-col justify-between relative group hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 bg-white"
                            >
                                <div>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
                                                <AvatarImage src={t.avatar_url} />
                                                <AvatarFallback className="bg-[#14873e] text-white text-xs font-bold">
                                                    {t.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold text-sm text-zinc-900 leading-none mb-1">{t.name}</h4>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <div key={idx} className={`w-1 h-1 rounded-full ${idx < (t.rating || 5) ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{t.type}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        {t.type === 'video' ? (
                                            <div
                                                className="w-full h-36 rounded-xl bg-zinc-900 flex flex-col items-center justify-center gap-2 cursor-pointer group/play overflow-hidden relative shadow-inner"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedVideo(t.video_url);
                                                }}
                                            >
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-20" />

                                                <div className="w-12 h-12 rounded-full bg-white backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/play:scale-110 group-hover/play:bg-[#ccf381]">
                                                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <span className="absolute -top-3 -left-1 text-4xl text-zinc-200 font-serif opacity-50">"</span>
                                                <p className="text-sm font-medium text-zinc-600 leading-relaxed line-clamp-5 pt-2 pl-2">
                                                    {t.content || 'No text content provided.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                                        {new Date(t.created_at).toLocaleDateString()}
                                    </p>
                                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${t.status === 'approved' ? 'bg-[#ccf381] text-black' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {t.status}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-end gap-3 pr-6">
                    <button
                        onClick={() => document.getElementById('testimonials-container')?.scrollBy({ left: -340, behavior: 'smooth' })}
                        className="w-12 h-12 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-900 hover:bg-[#14873e] hover:text-white transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => document.getElementById('testimonials-container')?.scrollBy({ left: 340, behavior: 'smooth' })}
                        className="w-12 h-12 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-900 hover:bg-[#14873e] hover:text-white transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Lower Section: Spaces & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                {/* Active Spaces */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-light text-zinc-900">Your Spaces</h3>
                        <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-black">View All</Button>
                    </div>

                    <div className="grid gap-4">
                        {/* New Space Button */}
                        <button
                            onClick={() => setCreateDialogOpen(true)}
                            className="w-full h-16 rounded-xl border-2 border-dashed border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <div className="w-6 h-6 rounded-full bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                                <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-zinc-400 group-hover:text-black transition-colors">Create New Space</span>
                        </button>

                        {spaces.map((space) => (
                            <div
                                key={space.id}
                                onClick={() => onManageSpace(space.id)}
                                className="group flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-xl border border-zinc-200/60 hover:border-black/20 hover:shadow-lg hover:bg-white transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-10 h-10 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                        <AvatarFallback className="bg-[#14873e] text-white text-xs font-bold rounded-lg rounded-tl-sm">
                                            {space.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-sm text-zinc-900 group-hover:underline">{space.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-zinc-400">/{space.slug}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-200" />
                                            <span className="text-[10px] font-bold text-zinc-400">
                                                {testimonials.filter(t => t.space_id === space.id).length} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-full hover:bg-zinc-100"
                                        onClick={(e) => { e.stopPropagation(); copyCollectionLink(space.slug); }}
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <button className="h-8 w-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onManageSpace(space.id); }}>
                                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`/collect/${space.slug}`, '_blank'); }}>
                                                <ExternalLink className="w-4 h-4 mr-2" /> Open Page
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Delete "${space.name}"?`)) {
                                                        const { error } = await deleteSpace(space.id);
                                                        if (error) {
                                                            toast({ variant: "destructive", title: "Error deleting space" });
                                                        } else {
                                                            toast({ title: "Space deleted" });
                                                        }
                                                    }
                                                }}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="w-8 h-8 rounded-full bg-[#14873e] text-white flex items-center justify-center">
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-light text-zinc-900">Latest Actions</h3>
                    <div className="organic-card p-0 overflow-hidden bg-white/40">
                        <RecentActivity testimonials={testimonials} />
                    </div>
                </div>
            </div>

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrl={selectedVideo || ""}
            />
        </div>
    );
};
