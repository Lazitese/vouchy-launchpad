import { useState } from "react";
import { Search, Download, Filter, CheckCircle2, Video, MessageSquare, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialGrid } from "@/components/dashboard/TestimonialGrid";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MiniTour, TESTIMONIALS_TOUR } from "@/components/dashboard/MiniTour";

interface TestimonialsViewProps {
    testimonials: any[];
    spaces: any[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDelete: (id: string) => void;
    onShare: (testimonial: any) => void;
}

export const TestimonialsView = ({
    testimonials,
    spaces,
    onApprove,
    onReject,
    onDelete,
    onShare
}: TestimonialsViewProps) => {
    const [statusFilter, setStatusFilter] = useState("all");
    const [spaceFilter, setSpaceFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredTestimonials = testimonials.filter(t => {
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        const matchesSpace = spaceFilter === "all" || t.space_id === spaceFilter;
        const matchesType = typeFilter === "all" || t.type === typeFilter;
        const matchesSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.content?.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSpace && matchesType && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header with Floating Toolbar Effect */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                            All Reviews
                        </h2>
                        <MiniTour
                            tourId="testimonials"
                            steps={TESTIMONIALS_TOUR}
                            triggerLabel="Learn"
                        />
                    </div>
                    <p className="text-zinc-500 font-medium">
                        Manage your approved testimonials
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search & Filter Bar */}
                    <div className="flex items-center p-1 bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-xl shadow-sm overflow-x-auto" data-tour-id="testimonials-search">
                        <div className="relative shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-transparent focus:outline-none text-sm w-32 md:w-48 placeholder:text-zinc-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="h-6 w-px bg-zinc-200 mx-2 shrink-0" />

                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors shrink-0" data-tour-id="testimonials-status-filter">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {['all', 'approved', 'pending', 'rejected'].map((f) => (
                                    <DropdownMenuItem key={f} onClick={() => setStatusFilter(f)} className="capitalize">
                                        {f === statusFilter && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                        {f}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-6 w-px bg-zinc-200 mx-2 shrink-0" />

                        {/* Space Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors shrink-0">
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">
                                        {spaceFilter === 'all' ? 'All Collections' : spaces.find(s => s.id === spaceFilter)?.name || 'Collection'}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setSpaceFilter('all')}>
                                    {spaceFilter === 'all' && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                    All Collections
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {spaces.map((s) => (
                                    <DropdownMenuItem key={s.id} onClick={() => setSpaceFilter(s.id)}>
                                        {spaceFilter === s.id && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                        {s.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-6 w-px bg-zinc-200 mx-2 shrink-0" />

                        {/* Type Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors shrink-0">
                                    {typeFilter === 'video' ? <Video className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                                    <span className="hidden sm:inline">{typeFilter === 'all' ? 'All Types' : typeFilter}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                                    {typeFilter === 'all' && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                    All Types
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTypeFilter('video')}>
                                    {typeFilter === 'video' && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                    Video
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTypeFilter('text')}>
                                    {typeFilter === 'text' && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                    Text
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Button
                        onClick={() => {
                            // Define headers for a professional report
                            const headers = [
                                "ID",
                                "Status",
                                "Type",
                                "Date Created",
                                "Author Name",
                                "Author Title",
                                "Company",
                                "Rating",
                                "Content",
                                "Video URL",
                                "Avatar URL"
                            ];

                            // Helper to escape CSV fields safely
                            const escapeCsvField = (field: any) => {
                                if (field === null || field === undefined) return '';
                                const stringField = String(field);
                                if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                                    return `"${stringField.replace(/"/g, '""')}"`;
                                }
                                return stringField;
                            };

                            // Generate rows
                            const rows = filteredTestimonials.map(t => [
                                t.id,
                                t.status?.toUpperCase() || 'PENDING',
                                t.type?.toUpperCase() || 'TEXT',
                                new Date(t.created_at).toLocaleDateString() + ' ' + new Date(t.created_at).toLocaleTimeString(),
                                t.name,
                                t.company, // Using company as primary role/title field
                                t.rating,
                                t.content,
                                t.video_url,
                                t.avatar_url
                            ].map(escapeCsvField).join(','));

                            // Combine headers and rows
                            const csvContent = [headers.join(','), ...rows].join('\n');

                            // Create and download blob
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement("a");
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", `vouchy_testimonials_${new Date().toISOString().split('T')[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="bg-[#14873e] text-white rounded-xl shadow-lg shadow-[#14873e]/20 hover:bg-[#0f6b30] transition-all h-12 px-6"
                        data-tour-id="testimonials-export"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div data-tour-id="testimonials-grid">
                <TestimonialGrid
                    testimonials={filteredTestimonials}
                    onApprove={onApprove}
                    onReject={onReject}
                    onDelete={onDelete}
                    onShare={onShare}
                />
            </div>
        </div>
    );
};
