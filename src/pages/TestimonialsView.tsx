
import { useState } from "react";
import { Search, Download, Filter, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestimonialGrid } from "@/components/dashboard/TestimonialGrid";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TestimonialsViewProps {
    testimonials: any[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDelete: (id: string) => void;
    onShare: (testimonial: any) => void;
}

export const TestimonialsView = ({
    testimonials,
    onApprove,
    onReject,
    onDelete,
    onShare
}: TestimonialsViewProps) => {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredTestimonials = testimonials.filter(t => {
        const matchesFilter = filter === "all" || t.status === filter;
        const matchesSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.content?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header with Floating Toolbar Effect */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-light text-zinc-900 tracking-tight mb-2">
                        Wall of Love
                    </h2>
                    <p className="text-zinc-500 font-medium">
                        Manage your approved testimonials
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search & Filter Bar */}
                    <div className="flex items-center p-1 bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-xl shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-transparent focus:outline-none text-sm w-40 md:w-64 placeholder:text-zinc-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="h-6 w-px bg-zinc-200 mx-2" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{filter === 'all' ? 'All Status' : filter}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {['all', 'approved', 'pending', 'rejected'].map((f) => (
                                    <DropdownMenuItem key={f} onClick={() => setFilter(f)} className="capitalize">
                                        {f === filter && <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#14873e]" />}
                                        {f}
                                    </DropdownMenuItem>
                                ))}
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
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <TestimonialGrid
                testimonials={filteredTestimonials}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                onShare={onShare}
            />
        </div>
    );
};
