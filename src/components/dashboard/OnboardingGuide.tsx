
import { Check, Copy, ExternalLink, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface OnboardingGuideProps {
    hasSpaces: boolean;
    hasTestimonials: boolean;
    onCreateSpace: () => void;
    latestSpaceSlug: string | null;
}

export const OnboardingGuide = ({
    hasSpaces,
    hasTestimonials,
    onCreateSpace,
    latestSpaceSlug
}: OnboardingGuideProps) => {
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        if (!latestSpaceSlug) return;
        const url = `${window.location.origin}/collect/${latestSpaceSlug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const steps = [
        {
            id: 1,
            title: "Create your first Space",
            description: "A Space is where you collect testimonials. Give it a name like 'Client Feedback' or 'Product Reviews'.",
            completed: hasSpaces,
            action: !hasSpaces ? (
                <Button onClick={onCreateSpace} className="bg-[#14873e] hover:bg-[#0f6b30] text-white gap-2">
                    <Plus className="w-4 h-4" /> Create Space
                </Button>
            ) : null
        },
        {
            id: 2,
            title: "Share the link",
            description: "Send your unique collection link to your clients via email, Slack, or social media.",
            completed: hasTestimonials, // Only completed when we get a testimonial? Or just partially done? 
            // Let's say this step is "active" if spaces exist but no testimonials yet.
            action: (hasSpaces && !hasTestimonials && latestSpaceSlug) ? (
                <div className="flex flex-col gap-3 w-full max-w-md">
                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
                        <code className="flex-1 p-2 text-xs text-zinc-500 truncate font-mono bg-transparent">
                            {window.location.origin}/collect/{latestSpaceSlug}
                        </code>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyLink}
                            className={copied ? "text-green-600" : ""}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                    <Button variant="outline" className="w-full gap-2" onClick={() => window.open(`/collect/${latestSpaceSlug}`, '_blank')}>
                        <ExternalLink className="w-4 h-4" /> Open Public Page
                    </Button>
                </div>
            ) : null
        },
        {
            id: 3,
            title: "Receive Feedback",
            description: "Wait for the magic! Video and text testimonials will appear here automatically.",
            completed: hasTestimonials,
            action: null
        }
    ];

    // If everything is done, we don't need to show this big guide, maybe just a small banner or nothing.
    // But the user asked for a visible guide.
    if (hasSpaces && hasTestimonials) return null;

    return (
        <div className="organic-card p-8 bg-white border-2 border-dashed border-zinc-200 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Share2 className="w-64 h-64" />
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Welcome to Vouchy! 👋</h2>
            <p className="text-zinc-500 mb-8 max-w-xl">
                You're just a few steps away from collecting authentic video testimonials. Follow this guide to get started.
            </p>

            <div className="space-y-6 max-w-2xl relative z-10">
                {steps.map((step, i) => (
                    <div key={step.id} className={`flex gap-4 ${step.completed ? "opacity-50" : "opacity-100"}`}>
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2
                                ${step.completed
                                    ? "bg-[#14873e] border-[#14873e] text-white"
                                    : "bg-white border-zinc-300 text-zinc-500"
                                }`}>
                                {step.completed ? <Check className="w-4 h-4" /> : step.id}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-0.5 flex-1 min-h-[30px] my-2 ${step.completed ? "bg-[#14873e]" : "bg-zinc-200"}`} />
                            )}
                        </div>
                        <div className="flex-1 pb-6">
                            <h3 className={`text-lg font-semibold mb-1 ${step.completed ? "text-zinc-900" : "text-zinc-900"}`}>
                                {step.title}
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                                {step.description}
                            </p>
                            {step.action && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {step.action}
                                </motion.div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
