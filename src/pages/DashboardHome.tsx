
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Copy, Check, X, ArrowUpRight, MessageSquare, Play, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { VideoModal } from "@/components/widgets/VideoModal";

interface DashboardHomeProps {
    user: any;
    spaces: any[];
    testimonials: any[];
    setCreateDialogOpen: (open: boolean) => void;
    copyCollectionLink: (slug: string) => void;
    setActiveView: (view: any) => void;
    onManageSpace: (spaceId: string) => void;
}

export const DashboardHome = ({
    user,
    spaces,
    testimonials,
    setCreateDialogOpen,
    copyCollectionLink,
    setActiveView,
    onManageSpace
}: DashboardHomeProps) => {
    const { toast } = useToast();
    const [filter, setFilter] = useState("All");
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const totalTestimonials = testimonials.length;
    const approvedCount = testimonials.filter(t => t.status === "approved").length;
    const pendingCount = testimonials.filter(t => t.status === "pending").length;

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

    function handleCopyLink(slug: any) {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="space-y-12">

            {/* Header Row Removed */}

            {/* Top Section: Analytics & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                <div className="lg:col-span-2 organic-card p-4 md:p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-4 md:mb-8 z-10 gap-3">
                        <div>
                            <h3 className="text-lg md:text-2xl font-light text-black mb-1">Activity & Insights</h3>
                            <p className="text-xs md:text-sm text-gray-400 font-medium">Last 7 Days</p>
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            {['7D', '30D', '3M'].map((range, i) => (
                                <button key={range} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${i === 0 ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-32 md:h-48 w-full z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.dailyCounts}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ccf381" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ccf381" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl flex flex-col gap-1">
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
                                    stroke="#000"
                                    strokeWidth={3}
                                    fill="url(#colorValue)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Stats Column */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="organic-card p-4 md:p-6 flex-1 flex flex-col justify-center">
                        <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center mb-4 text-lime-700">
                            <ExternalLink className="w-5 h-5" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-black mb-1">{analyticsData.avgRating}</p>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">Avg Rating</p>
                    </div>
                    <div className="organic-card p-4 md:p-6 flex-1 flex flex-col justify-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-black mb-1">{analyticsData.videoPercentage}%</p>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">Video Ratio</p>
                    </div>
                </div>
            </div>


            {/* Main Section: New Leads (Testimonials) */}
            < div className="space-y-6" >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3 md:gap-4">
                        <h3 className="text-xl md:text-2xl font-normal text-black">New Reviews</h3>
                        <span className="text-xs md:text-sm font-medium text-gray-400 border-b border-gray-200 pb-0.5">{testimonials.length} reviews</span>
                    </div>

                    {/* Pill Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                        {['All', 'Video', 'Text', 'High Rating', 'Low Rating'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${filter === f ? 'bg-black text-white shadow-lg shadow-black/10 scale-105' : 'bg-transparent text-gray-400 hover:bg-white hover:text-black hover:shadow-sm'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Horizontal Scroll List of Cards */}
                <div
                    id="testimonials-container"
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 md:px-0"
                >
                    {filteredTestimonials.length === 0 ? (
                        <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                            <p className="mb-4 font-medium">No reviews match this filter</p>
                            <Button variant="outline" onClick={() => setFilter("All")} className="rounded-full">Clear Filters</Button>
                        </div>
                    ) : (
                        filteredTestimonials.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="organic-card min-w-[300px] max-w-[300px] h-[320px] p-6 flex flex-col justify-between relative group hover:shadow-xl transition-all duration-300"
                            >
                                {/* Background Decorative Quote */}
                                <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
                                    <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M30 60 C30 75 25 85 10 90 L10 80 C20 75 20 70 20 60 L10 60 L10 30 L40 30 L40 60 Z M80 60 C80 75 75 85 60 90 L60 80 C70 75 70 70 70 60 L60 60 L60 30 L90 30 L90 60 Z" />
                                    </svg>
                                </div>

                                <div>
                                    {/* Header: Avatar + Stars */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="w-10 h-10 ring-2 ring-gray-50">
                                            <AvatarImage src={t.author_avatar_url} />
                                            <AvatarFallback className="bg-black text-white text-xs font-bold">
                                                {t.author_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, idx) => (
                                                <svg
                                                    key={idx}
                                                    className={`w-4 h-4 ${idx < (t.rating || 5) ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                                        {t.type === 'video' ? (
                                            <div
                                                className="w-full h-32 rounded-2xl bg-black flex flex-col items-center justify-center gap-2 cursor-pointer group/play overflow-hidden border border-black/5 shadow-inner transition-transform hover:scale-[1.02]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedVideo(t.video_url);
                                                }}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/play:scale-110">
                                                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                                                </div>
                                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest group-hover/play:text-white/80 transition-colors">
                                                    Watch Video
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-gray-700 leading-relaxed line-clamp-4 mb-2 italic">
                                                    "{t.content || 'No text content provided.'}"
                                                </p>
                                                <button className="text-xs font-bold text-lime-600 hover:underline flex items-center gap-1">
                                                    See more <span className="text-[10px]">↓</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Footer: Author Info */}
                                <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-black text-sm">{t.author_name}</h4>
                                        <p className="text-xs text-gray-400">{t.author_title || "Verified Customer"}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${t.status === 'approved' ? 'bg-lime-100 text-lime-700' : 'bg-orange-50 text-orange-600'}`}>
                                            {t.status}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                            {t.type === 'video' ? <Play className="w-3 h-3 fill-current" /> : <MessageSquare className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>


                            </motion.div>
                        ))

                    )}
                </div>

                {/* Carousel Navigation Buttons */}
                <div className="flex justify-end gap-2 pr-4 md:pr-0">
                    <button
                        onClick={() => {
                            const container = document.getElementById('testimonials-container');
                            if (container) container.scrollBy({ left: -340, behavior: 'smooth' });
                        }}
                        className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-black hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            const container = document.getElementById('testimonials-container');
                            if (container) container.scrollBy({ left: 340, behavior: 'smooth' });
                        }}
                        className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-black hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div> {/* Closing div for "Main Section: New Leads (Testimonials)" */}


            {/* Lower Section: Tasks / Spaces */}
            < div className="grid grid-cols-1 lg:grid-cols-2 gap-8" >
                {/* "Your Days Tasks" -> Recent Activity */}
                < div className="space-y-6" >
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-4">
                            <h3 className="text-2xl font-normal text-black">Active Spaces</h3>
                            <span className="text-sm font-medium text-gray-400 border-b border-gray-200 pb-0.5">{spaces.length} spaces</span>
                        </div>
                    </div>

                    {/* Lime Card Feature */}
                    <div className="lime-card p-8 relative overflow-hidden group hover:shadow-lg hover:bg-[#bef065] transition-all duration-300">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-black/20" />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-[#ccf381]/50">
                                <ExternalLink className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-black">Widget Embed</p>
                                <p className="text-sm opacity-60 font-medium">Active on 3 pages</p>
                            </div>
                        </div>

                        <Button
                            onClick={() => setActiveView('widget')}
                            className="w-full bg-black text-white rounded-xl h-12 hover:bg-gray-900 transition-colors shadow-lg shadow-black/10 font-medium"
                        >
                            Manage Widgets
                        </Button>
                    </div>

                    {/* Grid Layout for Spaces */}
                    <div className="grid grid-cols-2 gap-4">
                        {spaces.map((space, index) => (
                            <div
                                key={space.id}
                                onClick={() => onManageSpace(space.id)}
                                className="group flex flex-col justify-between bg-white rounded-[24px] p-5 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:border-black/5 cursor-pointer relative overflow-hidden h-40"
                            >

                                {/* Decorative Gradient Blob */}
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:bg-[#ccf381]/50 transition-colors duration-500" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <Avatar className="w-10 h-10 shadow-sm">
                                            <AvatarFallback className={`text-sm font-bold ${index % 2 === 0 ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
                                                {space.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); handleCopyLink(space.slug); }}
                                            className="w-8 h-8 -mr-2 -mt-2 rounded-full hover:bg-white/80"
                                        >
                                            <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors" />
                                        </Button>
                                    </div>
                                    <h4 className="font-bold text-lg text-black leading-tight line-clamp-1 group-hover:underline decoration-2 underline-offset-4 decoration-[#ccf381] decoration-wavy transition-all">{space.name}</h4>
                                    <p className="text-[10px] font-medium text-gray-400 tracking-wider uppercase mt-1">/{space.slug}</p>
                                </div>

                                <div className="relative z-10 flex items-center justify-between pt-4 mt-auto">
                                    <span className="text-xs font-bold text-gray-300 group-hover:text-black transition-colors">Manage</span>
                                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                        <ExternalLink className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Button - Solid Black Card */}
                        <button
                            onClick={() => setCreateDialogOpen(true)}
                            className="h-40 rounded-[24px] bg-black hover:bg-gray-900 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-95 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-base font-bold text-white tracking-wide">New Space</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-normal text-black">Summary</h3>

                    <RecentActivity testimonials={testimonials} />
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
