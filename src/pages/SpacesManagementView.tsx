
import { useState, useEffect } from "react";
import {
    Plus, Settings, Trash2, Check, X,
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
import { MiniTour, SPACES_TOUR } from "@/components/dashboard/MiniTour";
import { FormFieldsSettings } from "@/components/settings/FormFieldsSettings";
import { FormSettings, mergeFormSettings } from "@/types/formSettings";


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
    const [formSettingsLoading, setFormSettingsLoading] = useState(false);


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
            t.name.toLowerCase().includes(searchQuery.toLowerCase());
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

    const handleFormSettingsSave = async (formSettings: FormSettings) => {
        if (!selectedSpaceId) return;
        setFormSettingsLoading(true);

        const { error } = await updateSpace(selectedSpaceId, { form_settings: formSettings });

        setFormSettingsLoading(false);
        if (error) {
            toast({
                variant: "destructive",
                title: "Error updating form settings",
                description: "Could not save changes.",
            });
        } else {
            toast({
                title: "Form settings updated",
                description: "Your form customization has been saved.",
            });
        }
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
                    Collections
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
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-light text-zinc-900">Your Collections</h2>
                        <MiniTour
                            tourId="spaces-management"
                            steps={SPACES_TOUR}
                            triggerLabel="Learn"
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsCreatingSpace(true)}
                        className="h-8 w-8 rounded-full bg-[#14873e] text-white hover:bg-[#0f6b30] p-0 shadow-sm"
                        data-tour-id="spaces-create"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {isCreatingSpace && (
                    <div className="mb-4 p-3 bg-white rounded-xl border border-zinc-200 shadow-lg animate-in fade-in slide-in-from-top-2">
                        <Input
                            value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            placeholder="Collection Name..."
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
                <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide" data-tour-id="spaces-list">
                    {spaces.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-2xl px-4">
                            <p className="text-sm text-zinc-400 font-medium mb-3">No collections yet</p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsCreatingSpace(true)}
                                className="w-full text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Create Collection
                            </Button>
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

            {/* MAIN CONTENT: Collection Preview */}
            <main className="flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-xl border border-zinc-200/50 rounded-2xl overflow-hidden shadow-sm hidden md:flex">
                {selectedSpace ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-zinc-100 flex flex-col gap-4 bg-white/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-light text-zinc-900 flex items-center gap-3">
                                        {selectedSpace.name}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-2 text-xs font-bold border-zinc-200 text-zinc-600 hover:text-white hover:bg-[#14873e] hover:border-[#14873e]"
                                                onClick={() => copyCollectionLink(selectedSpace.slug)}
                                                data-tour-id="spaces-share"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                                Copy Link
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 rounded-full p-0 text-zinc-400 hover:text-black"
                                                onClick={() => window.open(`/collect/${selectedSpace.slug}`, '_blank')}
                                                title="Open Public Page"
                                                data-tour-id="spaces-settings"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </h1>
                                    <p className="text-base text-zinc-500 mt-1">
                                        Customize your collection form fields, theme, and messages.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Customization */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <FormFieldsSettings
                                formSettings={mergeFormSettings(selectedSpace.form_settings)}
                                onSave={handleFormSettingsSave}
                                loading={formSettingsLoading}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <Folder className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="font-medium">No collection selected</p>
                        <p className="text-xs text-zinc-400">Select a collection from the list or create a new one.</p>
                        {spaces.length === 0 && (
                            <Button onClick={() => setIsCreatingSpace(true)} className="mt-2 bg-[#14873e] text-white hover:bg-[#0f6b30]">
                                <Plus className="w-4 h-4 mr-2" /> Create First Collection
                            </Button>
                        )}
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
