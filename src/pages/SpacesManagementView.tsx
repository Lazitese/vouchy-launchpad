
import { useState, useEffect } from "react";
import {
    Plus, Settings, Trash2, Edit2, Check, X,
    Video, MessageSquare, Star, MoreVertical,
    Search, Filter, Copy, ExternalLink, ChevronDown, Play, Folder, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Testimonial } from "@/hooks/useTestimonials";
import { Space } from "@/hooks/useSpaces";
import { motion, AnimatePresence } from "framer-motion";
import { VideoModal } from "@/components/widgets/VideoModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SpacesManagementViewProps {
    spaces: Space[];
    testimonials: Testimonial[];
    createSpace: (name: string) => Promise<any>;
    updateSpace: (id: string, updates: any) => Promise<any>;
    deleteSpace: (id: string) => Promise<any>;
    updateTestimonial: (id: string, status: string) => Promise<any>;
    deleteTestimonial: (id: string) => Promise<any>;
    onManageSpace: (spaceId: string) => void;
}

export const SpacesManagementView = ({
    spaces,
    testimonials,
    createSpace,
    updateSpace,
    deleteSpace,
    updateTestimonial,
    deleteTestimonial,
    onManageSpace,
}: SpacesManagementViewProps) => {
    const { toast } = useToast();
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
    const [isCreatingSpace, setIsCreatingSpace] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
    const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
    const [editingSpaceName, setEditingSpaceName] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [activeMobileTab, setActiveMobileTab] = useState<"spaces" | "testimonials">("spaces");

    // Auto-select first space
    useEffect(() => {
        if (spaces.length > 0 && !selectedSpaceId) {
            setSelectedSpaceId(spaces[0].id);
        }
    }, [spaces, selectedSpaceId]);

    const selectedSpace = spaces.find(s => s.id === selectedSpaceId);

    // Filter testimonials for selected space
    const spaceTestimonials = testimonials.filter(t => t.space_id === selectedSpaceId);
    const filteredTestimonials = spaceTestimonials.filter(t => {
        const matchesSearch = t.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.author_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateSpace = async () => {
        if (!newSpaceName.trim()) return;

        const { error } = await createSpace(newSpaceName.trim());

        if (error) {
            toast({
                variant: "destructive",
                title: "Error creating space",
                description: "Could not create space.",
            });
        } else {
            toast({ title: "Space created successfully" });
            setNewSpaceName("");
            setIsCreatingSpace(false);
        }
    };

    const handleDeleteSpace = async (spaceId: string) => {
        const { error } = await deleteSpace(spaceId);
        if (error) {
            toast({ variant: "destructive", title: "Error deleting space" });
        } else {
            toast({ title: "Space deleted" });
            if (selectedSpaceId === spaceId) {
                setSelectedSpaceId(spaces[0]?.id || null);
            }
        }
    };

    const copyCollectionLink = (slug: string) => {
        const url = `${window.location.origin}/collect/${slug}`;
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard" });
    };

    return (
        <div className="flex flex-col md:flex-row md:h-[calc(100vh-8rem)] gap-6">

            {/* Mobile Tab Toggle */}
            <div className="md:hidden flex p-1 bg-zinc-100 rounded-xl mb-4">
                <button
                    onClick={() => setActiveMobileTab("spaces")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                        activeMobileTab === "spaces" ? "bg-white text-black shadow-sm" : "text-zinc-400"
                    )}
                >
                    <Folder className="w-3.5 h-3.5" />
                    Spaces
                </button>
                <button
                    onClick={() => setActiveMobileTab("testimonials")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                        activeMobileTab === "testimonials" ? "bg-white text-black shadow-sm" : "text-zinc-400"
                    )}
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reviews
                </button>
            </div>

            {/* LEFT SIDEBAR: Spaces List */}
            <aside className={cn(
                "w-full md:w-80 flex flex-col shrink-0 transition-opacity duration-200",
                activeMobileTab === "spaces" ? "opacity-100 flex" : "hidden md:flex opacity-100"
            )}>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-light text-zinc-900">Your Spaces</h2>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsCreatingSpace(true)}
                        className="h-8 w-8 rounded-full bg-[#14873e] text-white hover:bg-[#0f6b30] p-0 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {isCreatingSpace && (
                    <div className="mb-4 p-3 bg-white rounded-xl border border-zinc-200 shadow-lg animate-in fade-in slide-in-from-top-2">
                        <Input
                            value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            placeholder="Space Name..."
                            className="mb-2 bg-zinc-50 border-zinc-200 h-9 text-sm"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleCreateSpace()}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleCreateSpace} className="flex-1 h-8 bg-[#14873e] text-white hover:bg-[#0f6b30]">Create</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsCreatingSpace(false)} className="h-8">Cancel</Button>
                        </div>
                    </div>
                )}

                {/* List Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
                    {spaces.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-2xl">
                            <p className="text-sm text-zinc-400 font-medium">No spaces yet</p>
                        </div>
                    ) : (
                        spaces.map((space) => {
                            const isSelected = selectedSpaceId === space.id;
                            const count = testimonials.filter(t => t.space_id === space.id).length;

                            return (
                                <div
                                    key={space.id}
                                    onClick={() => {
                                        setSelectedSpaceId(space.id);
                                        setActiveMobileTab("testimonials");
                                    }}
                                    className={cn(
                                        "group relative p-4 rounded-xl border cursor-pointer transition-all duration-300",
                                        isSelected
                                            ? "bg-[#14873e] border-[#14873e] shadow-lg shadow-[#14873e]/20 z-10 scale-[1.02]"
                                            : "bg-white/60 hover:bg-white border-zinc-200/50 hover:border-zinc-300 hover:shadow-md"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className={cn("font-bold text-sm truncate pr-4", isSelected ? "text-white" : "text-zinc-900")}>
                                            {space.name}
                                        </h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <button className={cn("p-1 rounded-md transition-colors", isSelected ? "hover:bg-white/20 text-white/70 hover:text-white" : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900")}>
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
                                                    onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${space.name}"?`)) handleDeleteSpace(space.id); }}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-[10px] font-mono", isSelected ? "text-white/70" : "text-zinc-400")}>/{space.slug}</span>
                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600")}>
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* MAIN CONTENT: Testimonials */}
            <main className={cn(
                "flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-xl border border-zinc-200/50 rounded-2xl overflow-hidden shadow-sm",
                activeMobileTab === "testimonials" ? "flex" : "hidden md:flex"
            )}>
                {selectedSpace ? (
                    <>
                        {/* Toolbar */}
                        <div className="p-4 md:p-6 border-b border-zinc-100 flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-light text-zinc-900 flex items-center gap-2">
                                        {selectedSpace.name}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 rounded-full p-0 text-zinc-400 hover:text-white hover:bg-[#14873e]"
                                            onClick={() => copyCollectionLink(selectedSpace.slug)}
                                            title="Copy Collection Link"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </h1>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Showing {filteredTestimonials.length} of {spaceTestimonials.length} items
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="pl-9 w-full md:w-64 bg-white border-zinc-200 h-9 text-sm"
                                        />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-9 gap-2 bg-white px-3">
                                                <Filter className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline capitalize">{statusFilter}</span>
                                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {['all', 'approved', 'pending', 'rejected'].map(s => (
                                                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s as any)} className="capitalize">
                                                    {s}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-50/30 scrollbar-hide">
                            {filteredTestimonials.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                    <p>No testimonials found here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {filteredTestimonials.map((t) => (
                                            <motion.div
                                                key={t.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="group bg-white rounded-xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative"
                                            >

                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9 ring-1 ring-zinc-100">
                                                            <AvatarImage src={t.author_avatar_url || ''} />
                                                            <AvatarFallback className="text-xs bg-[#14873e] text-white font-bold">{t.author_name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h4 className="font-bold text-sm text-zinc-900 leading-tight">{t.author_name}</h4>
                                                            <div className="flex gap-0.5 mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} className={`text-[10px] ${i < t.rating ? 'text-zinc-900' : 'text-zinc-200'}`}>★</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-1 text-zinc-300 hover:text-zinc-900 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => { if (confirm("Delete?")) deleteTestimonial(t.id); }} className="text-red-600">
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="flex-1">
                                                    {t.type === 'video' ? (
                                                        <div
                                                            className="w-full h-32 bg-zinc-900 rounded-lg flex items-center justify-center cursor-pointer group/play relative overflow-hidden"
                                                            onClick={() => setSelectedVideo(t.video_url)}
                                                        >
                                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/play:scale-110">
                                                                <Play className="w-4 h-4 ml-0.5 fill-black" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-zinc-600 italic line-clamp-4">"{t.content}"</p>
                                                    )}
                                                </div>

                                                <div className="pt-3 border-t border-zinc-50 flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${t.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : t.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                            {t.status}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400 font-mono">
                                                            {new Date(t.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => updateTestimonial(t.id, 'approved')}
                                                            className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => updateTestimonial(t.id, 'rejected')}
                                                            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <Folder className="w-8 h-8 opacity-20" />
                        </div>
                        <p>Select a space to view details</p>
                    </div>
                )}
            </main>

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrl={selectedVideo || ""}
            />
        </div>
    );
};
