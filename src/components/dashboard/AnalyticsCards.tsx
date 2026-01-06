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
                <div key={stat.label} className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
                    <p className="text-sm text-subtext mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};
