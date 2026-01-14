import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestimonialGrid } from "@/components/dashboard/TestimonialGrid";

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
        const matchesSearch = t.author_name.toLowerCase().includes(search.toLowerCase()) ||
            t.content?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-black">
                        Wall of Love
                    </h2>
                    <p className="text-gray-500">Manage your approved testimonials</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 bg-white border-gray-200 hover:bg-gray-50 text-black shadow-sm"
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
                                t.author_name,
                                t.author_title,
                                t.author_company,
                                t.rating,
                                t.content,
                                t.video_url,
                                t.author_avatar_url
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
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search testimonials..."
                        className="pl-9 bg-transparent border-none focus-visible:ring-0 placeholder:text-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                    {['all', 'approved', 'pending'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`
                px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize
                ${filter === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}
              `}
                        >
                            {tab}
                        </button>
                    ))}
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
