import { useState, useEffect } from "react";
import {
    Plus, Settings, Trash2, Edit2, Check, X,
    Video, MessageSquare, Star, MoreVertical,
    Search, Filter, Copy, ExternalLink, ChevronDown, Play, Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface SpacesManagementViewProps {
    spaces: Space[];
    testimonials: Testimonial[];
    createSpace: (name: string) => Promise<any>;
    updateSpace: (id: string, updates: any) => Promise<any>;
    deleteSpace: (id: string) => Promise<any>;
    updateTestimonial: (id: string, status: string) => Promise<any>;
    deleteTestimonial: (id: string) => Promise<any>;
}

export const SpacesManagementView = ({
    spaces,
    testimonials,
    createSpace,
    updateSpace,
    deleteSpace,
    updateTestimonial,
    deleteTestimonial,
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

    const handleUpdateSpaceName = async (spaceId: string) => {
        if (!editingSpaceName.trim()) return;

        const { error } = await updateSpace(spaceId, { name: editingSpaceName.trim() });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error updating space",
            });
        } else {
            toast({ title: "Space updated" });
            setEditingSpaceId(null);
        }
    };

    const handleDeleteSpace = async (spaceId: string) => {
        const { error } = await deleteSpace(spaceId);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error deleting space",
            });
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-lime-100 text-lime-700 border-lime-200";
            case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
            case "rejected": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:h-[calc(100vh-6rem)] bg-background border rounded-3xl shadow-sm overflow-visible md:overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border">

            {/* Mobile Tab Toggle */}
            <div className="md:hidden flex p-2 bg-gray-50/50 border-b gap-2 shrink-0 z-20">
                <button
                    onClick={() => setActiveMobileTab("spaces")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeMobileTab === "spaces" ? "bg-black text-white shadow-lg" : "text-gray-400 bg-white/50"}`}
                >
                    <Folder className="w-3.5 h-3.5" />
                    List
                </button>
                <button
                    onClick={() => setActiveMobileTab("testimonials")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeMobileTab === "testimonials" ? "bg-black text-white shadow-lg" : "text-gray-400 bg-white/50"}`}
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reviews
                </button>
            </div>

            {/* LEFT SIDEBAR: Spaces List */}
            <aside className={`w-full md:w-80 bg-card border-r flex flex-col shrink-0 min-h-0 ${activeMobileTab === "spaces" ? "flex flex-1" : "hidden md:flex h-full"}`}>
                {/* Header - Hidden on mobile as tabs provide context */}
                <div className="hidden md:block p-6 border-b">
                    <h2 className="text-xl font-bold text-black dark:text-white">Spaces</h2>
                </div>

                {/* Create New Space Button */}
                <div className="p-4 border-b">
                    {!isCreatingSpace ? (
                        <Button
                            onClick={() => setIsCreatingSpace(true)}
                            className="w-full bg-black text-white hover:bg-gray-800 rounded-xl h-11"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Space
                        </Button>
                    ) : (
                        <div className="space-y-2">
                            <Input
                                value={newSpaceName}
                                onChange={(e) => setNewSpaceName(e.target.value)}
                                placeholder="Space name..."
                                className="bg-gray-50 border-gray-200"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleCreateSpace()}
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCreateSpace}
                                    size="sm"
                                    className="flex-1 bg-black text-white hover:bg-gray-800"
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Create
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsCreatingSpace(false);
                                        setNewSpaceName("");
                                    }}
                                    size="sm"
                                    variant="outline"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Spaces List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 scrollbar-thin">
                    {spaces.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-sm">No spaces yet</p>
                            <p className="text-xs mt-1">Create your first space to get started</p>
                        </div>
                    ) : (
                        spaces.map((space) => {
                            const isSelected = selectedSpaceId === space.id;
                            const isEditing = editingSpaceId === space.id;
                            const count = testimonials.filter(t => t.space_id === space.id).length;

                            return (
                                <div
                                    key={space.id}
                                    className={`
                                        group rounded-xl border p-3 transition-all cursor-pointer
                                        ${isSelected
                                            ? "bg-black text-white border-black shadow-md"
                                            : "bg-white hover:bg-gray-50 border-gray-200"}
                                    `}
                                    onClick={() => {
                                        if (!isEditing) {
                                            setSelectedSpaceId(space.id);
                                            setActiveMobileTab("testimonials");
                                        }
                                    }}
                                >
                                    {isEditing ? (
                                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                value={editingSpaceName}
                                                onChange={(e) => setEditingSpaceName(e.target.value)}
                                                className="bg-gray-50 border-gray-200 h-8 text-sm"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleUpdateSpaceName(space.id);
                                                    if (e.key === "Escape") setEditingSpaceId(null);
                                                }}
                                            />
                                            <div className="flex gap-1">
                                                <Button
                                                    onClick={() => handleUpdateSpaceName(space.id)}
                                                    size="sm"
                                                    className="flex-1 h-7 text-xs bg-black text-white"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={() => setEditingSpaceId(null)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-bold text-sm truncate ${isSelected ? "text-white" : "text-black"}`}>
                                                        {space.name}
                                                    </h3>
                                                    <p className={`text-xs truncate ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                                        /{space.slug}
                                                    </p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <button className={`p-1 rounded hover:bg-white/10 ${isSelected ? "text-white" : "text-gray-400"}`}>
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingSpaceId(space.id);
                                                            setEditingSpaceName(space.name);
                                                        }}>
                                                            <Edit2 className="w-4 h-4 mr-2" />
                                                            Rename
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyCollectionLink(space.slug);
                                                        }}>
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Copy Link
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`/collect/${space.slug}`, '_blank');
                                                        }}>
                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                            Open Page
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Delete "${space.name}"? This cannot be undone.`)) {
                                                                    handleDeleteSpace(space.id);
                                                                }
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className={`text-xs font-medium ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                                                {count} {count === 1 ? 'testimonial' : 'testimonials'}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* MAIN CONTENT: Testimonials */}
            <main className={`flex-1 flex flex-col bg-gray-50/50 md:overflow-hidden md:min-h-0 ${activeMobileTab === "testimonials" ? "flex" : "hidden md:flex"}`}>
                {selectedSpace ? (
                    <>
                        <div className="bg-white border-b p-3 md:p-6 shrink-0">
                            {/* Space Title - Hidden on mobile to save space */}
                            <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white">{selectedSpace.name}</h1>
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                                        {filteredTestimonials.length} of {spaceTestimonials.length} testimonials
                                    </p>
                                </div>
                                <Button
                                    onClick={() => copyCollectionLink(selectedSpace.slug)}
                                    variant="outline"
                                    className="rounded-full w-full sm:w-auto"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Link
                                </Button>
                            </div>

                            {/* Mobile: Show only space name and count, no copy button */}
                            <div className="md:hidden mb-3">
                                <h1 className="text-base font-bold text-black">{selectedSpace.name}</h1>
                                <p className="text-xs text-gray-500">
                                    {filteredTestimonials.length} of {spaceTestimonials.length}
                                </p>
                            </div>

                            {/* Filters - More compact on mobile */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="pl-10 bg-gray-50 border-gray-200 h-8 md:h-9 text-sm"
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2 h-8 md:h-9 justify-between text-xs md:text-sm">
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">
                                                    {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Testimonials Grid */}
                        <div className="p-4 md:p-6 md:flex-1 md:overflow-y-auto md:min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {filteredTestimonials.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No testimonials found</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {searchQuery || statusFilter !== "all"
                                            ? "Try adjusting your filters"
                                            : "Share your collection link to start receiving testimonials"}
                                    </p>
                                </div>
                            ) : (
                                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {filteredTestimonials.map((testimonial, index) => (
                                            <motion.div
                                                key={testimonial.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-lg transition-all group mb-4 md:mb-6 break-inside-avoid"
                                            >
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-10 h-10 ring-2 ring-gray-50">
                                                            <AvatarImage src={testimonial.author_avatar_url || undefined} />
                                                            <AvatarFallback className="bg-black text-white text-xs font-bold">
                                                                {testimonial.author_name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-sm text-black truncate">{testimonial.author_name}</h4>
                                                            <p className="text-xs text-gray-400 truncate">{testimonial.author_title || "Customer"}</p>
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => updateTestimonial(testimonial.id, "approved")}>
                                                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => updateTestimonial(testimonial.id, "rejected")}>
                                                                <X className="w-4 h-4 mr-2 text-red-600" />
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    if (confirm("Delete this testimonial?")) {
                                                                        deleteTestimonial(testimonial.id);
                                                                    }
                                                                }}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex gap-0.5 mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < (testimonial.rating || 5)
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-gray-200 fill-gray-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-h-[100px] flex flex-col justify-center">
                                                    {testimonial.type === 'video' ? (
                                                        <div
                                                            className="w-full h-24 rounded-xl bg-black flex flex-col items-center justify-center gap-1.5 cursor-pointer group/play overflow-hidden border border-black/5 shadow-inner transition-transform hover:scale-[1.02]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedVideo(testimonial.video_url);
                                                            }}
                                                        >
                                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/play:scale-110">
                                                                <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest group-hover/play:text-white/80 transition-colors">
                                                                Watch Video
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-700 leading-relaxed italic">
                                                            "{testimonial.content || "No content"}"
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(testimonial.status)}`}>
                                                            {testimonial.status}
                                                        </span>
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${testimonial.type === "video" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-600"
                                                            }`}>
                                                            {testimonial.type === "video" ? (
                                                                <Video className="w-3.5 h-3.5" />
                                                            ) : (
                                                                <MessageSquare className="w-3.5 h-3.5" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(testimonial.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-500 font-medium">Select a space to view testimonials</p>
                        </div>
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
