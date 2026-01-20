import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X, Check, HelpCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TourStep {
    targetId: string;
    title: string;
    description: string;
    position?: "right" | "left" | "top" | "bottom";
}

interface MiniTourProps {
    tourId: string; // Unique ID for localStorage
    steps: TourStep[];
    triggerLabel?: string;
    triggerIcon?: React.ReactNode;
    onComplete?: () => void;
}

export const MiniTour = ({
    tourId,
    steps,
    triggerLabel = "Quick Tour",
    triggerIcon,
    onComplete
}: MiniTourProps) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const storageKey = `vouchy_minitour_${tourId}`;

    const updateTargetPosition = useCallback(() => {
        if (!isActive || currentStep >= steps.length) return;

        const step = steps[currentStep];
        const element = document.querySelector(`[data-tour-id="${step.targetId}"]`);

        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);

            // Add highlight
            document.querySelectorAll(".mini-tour-highlight").forEach(el =>
                el.classList.remove("mini-tour-highlight", "relative", "z-[70]")
            );
            element.classList.add("mini-tour-highlight", "relative", "z-[70]");
        } else {
            setTargetRect(null);
        }
    }, [isActive, currentStep, steps]);

    useEffect(() => {
        if (isActive) {
            // Small delay to let elements render
            const timer = setTimeout(updateTargetPosition, 150);
            window.addEventListener("resize", updateTargetPosition);
            window.addEventListener("scroll", updateTargetPosition, true);

            return () => {
                clearTimeout(timer);
                window.removeEventListener("resize", updateTargetPosition);
                window.removeEventListener("scroll", updateTargetPosition, true);
            };
        }
    }, [isActive, currentStep, updateTargetPosition]);

    const startTour = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const completeTour = () => {
        setIsActive(false);
        setCurrentStep(0);
        localStorage.setItem(storageKey, "true");

        // Cleanup highlights
        document.querySelectorAll(".mini-tour-highlight").forEach(el =>
            el.classList.remove("mini-tour-highlight", "relative", "z-[70]")
        );

        onComplete?.();
    };

    const closeTour = () => {
        setIsActive(false);
        setCurrentStep(0);

        // Cleanup highlights
        document.querySelectorAll(".mini-tour-highlight").forEach(el =>
            el.classList.remove("mini-tour-highlight", "relative", "z-[70]")
        );
    };

    // Calculate tooltip position
    const getTooltipStyle = () => {
        if (!targetRect) return {};

        const step = steps[currentStep];
        const position = step.position || "right";
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        const gap = 16;

        let top = targetRect.top;
        let left = targetRect.left;

        switch (position) {
            case "right":
                top = Math.max(16, targetRect.top + targetRect.height / 2 - tooltipHeight / 2);
                left = targetRect.right + gap;
                break;
            case "left":
                top = Math.max(16, targetRect.top + targetRect.height / 2 - tooltipHeight / 2);
                left = targetRect.left - tooltipWidth - gap;
                break;
            case "top":
                top = targetRect.top - tooltipHeight - gap;
                left = Math.max(16, targetRect.left + targetRect.width / 2 - tooltipWidth / 2);
                break;
            case "bottom":
                top = targetRect.bottom + gap;
                left = Math.max(16, targetRect.left + targetRect.width / 2 - tooltipWidth / 2);
                break;
        }

        // Keep within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + tooltipWidth > viewportWidth - 16) {
            left = viewportWidth - tooltipWidth - 16;
        }
        if (left < 16) left = 16;
        if (top + tooltipHeight > viewportHeight - 16) {
            top = viewportHeight - tooltipHeight - 16;
        }
        if (top < 16) top = 16;

        return { top, left };
    };

    const step = steps[currentStep];

    return (
        <>
            {/* Trigger Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={startTour}
                className="gap-2 text-zinc-500 hover:text-[#14873e] hover:bg-[#14873e]/5 rounded-full h-9 px-4 text-xs font-medium transition-all"
            >
                {triggerIcon || <Lightbulb className="w-3.5 h-3.5" />}
                {triggerLabel}
            </Button>

            <AnimatePresence>
                {isActive && targetRect && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-[2px]"
                            onClick={closeTour}
                        />

                        {/* Highlight Cutout Effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed z-[66] pointer-events-none"
                            style={{
                                top: targetRect.top - 6,
                                left: targetRect.left - 6,
                                width: targetRect.width + 12,
                                height: targetRect.height + 12,
                                boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                                borderRadius: 12,
                            }}
                        >
                            {/* Glow ring */}
                            <div
                                className="absolute inset-0 rounded-xl ring-2 ring-[#14873e] ring-offset-2 ring-offset-transparent animate-pulse"
                            />
                        </motion.div>

                        {/* Tooltip Card */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="fixed z-[70] w-80 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden"
                            style={getTooltipStyle()}
                        >
                            {/* Header */}
                            <div className="p-5 pb-3">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#14873e] flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white">
                                                {currentStep + 1}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                            Step {currentStep + 1} of {steps.length}
                                        </span>
                                    </div>
                                    <button
                                        onClick={closeTour}
                                        className="text-zinc-300 hover:text-zinc-500 transition-colors p-1 -m-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="font-bold text-lg text-zinc-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
                                {/* Step Dots */}
                                <div className="flex gap-1.5">
                                    {steps.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentStep(i)}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                i === currentStep
                                                    ? "bg-[#14873e] w-4"
                                                    : i < currentStep
                                                        ? "bg-[#14873e]/40"
                                                        : "bg-zinc-200"
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center gap-2">
                                    {currentStep > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handlePrev}
                                            className="h-8 px-3 text-xs font-medium text-zinc-500 hover:text-zinc-900"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                            Back
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        onClick={handleNext}
                                        className="h-8 px-4 text-xs font-bold bg-[#14873e] hover:bg-[#0f6b30] text-white rounded-lg gap-1.5 shadow-lg shadow-[#14873e]/20"
                                    >
                                        {currentStep === steps.length - 1 ? (
                                            <>
                                                Done
                                                <Check className="w-3.5 h-3.5" />
                                            </>
                                        ) : (
                                            <>
                                                Next
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// Pre-defined tour configurations for each view
export const WIDGET_LAB_TOUR: TourStep[] = [
    {
        targetId: "widget-collection-filter",
        title: "Collection Filter",
        description: "Select which Collections to include in your embed. Filter testimonials by source to show only relevant reviews.",
        position: "right"
    },
    {
        targetId: "widget-layout-style",
        title: "Layout Styles",
        description: "Choose how your testimonials are displayed. Pick from Grid, Masonry, Carousel, and more beautiful layouts.",
        position: "right"
    },
    {
        targetId: "widget-customization",
        title: "Customization",
        description: "Fine-tune colors, borders, shadows, and text styles to match your brand perfectly.",
        position: "right"
    },
    {
        targetId: "widget-device-preview",
        title: "Device Preview",
        description: "See exactly how your widget looks on desktop, tablet, and mobile devices before embedding.",
        position: "bottom"
    },
    {
        targetId: "widget-embed-button",
        title: "Get Embed Code",
        description: "Copy the generated code snippet and paste it into your website's HTML. It's that simple!",
        position: "top"
    }
];

export const TESTIMONIALS_TOUR: TourStep[] = [
    {
        targetId: "testimonials-search",
        title: "Search & Filter",
        description: "Quickly find specific testimonials by name, content, status, collection, or type.",
        position: "bottom"
    },
    {
        targetId: "testimonials-status-filter",
        title: "Status Filter",
        description: "Filter by approval status - see pending, approved, or rejected testimonials.",
        position: "bottom"
    },
    {
        targetId: "testimonials-export",
        title: "Export to CSV",
        description: "Download all your filtered testimonials as a professional CSV report for analysis or backup.",
        position: "left"
    },
    {
        targetId: "testimonials-grid",
        title: "Testimonial Cards",
        description: "View, approve, reject, delete, or share any testimonial. Click on video testimonials to play them.",
        position: "top"
    }
];

export const SPACES_TOUR: TourStep[] = [
    {
        targetId: "spaces-create",
        title: "Create Collection",
        description: "Start a new Collection (formerly 'Space') to organize testimonials for different products, campaigns, or clients.",
        position: "bottom"
    },
    {
        targetId: "spaces-list",
        title: "Your Collections",
        description: "All your Collections appear here. Each one has its own unique collection link to share.",
        position: "right"
    },
    {
        targetId: "spaces-share",
        title: "Share Link",
        description: "Copy your collection link and send it to customers. They can submit video or text testimonials easily.",
        position: "left"
    },
    {
        targetId: "spaces-settings",
        title: "Collection Settings",
        description: "Customize the collection page appearance, questions, and branding for each Collection.",
        position: "left"
    }
];

export const DASHBOARD_TOUR: TourStep[] = [
    {
        targetId: "dashboard-stats",
        title: "Quick Stats",
        description: "Get an at-a-glance view of your total testimonials, videos, and pending approvals.",
        position: "bottom"
    },
    {
        targetId: "dashboard-recent",
        title: "Recent Activity",
        description: "See your latest testimonials and quickly take action on pending submissions.",
        position: "left"
    },
    {
        targetId: "dashboard-spaces",
        title: "Your Collections",
        description: "Access all your Collections directly from here. Click to manage or view collection details.",
        position: "top"
    }
];
