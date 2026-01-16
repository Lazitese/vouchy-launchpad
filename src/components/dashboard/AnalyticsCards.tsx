interface AnalyticsCardsProps {
    totalTestimonials: number;
    approvedCount: number;
    pendingCount: number;
}

export const AnalyticsCards = ({
    totalTestimonials,
    approvedCount,
    pendingCount,
}: AnalyticsCardsProps) => {
    const stats = [
        { label: "Total Testimonials", value: totalTestimonials },
        { label: "Approved", value: approvedCount },
        { label: "Pending", value: pendingCount },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
                <div key={stat.label} className="organic-card p-6">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};
