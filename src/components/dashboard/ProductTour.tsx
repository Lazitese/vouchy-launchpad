
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
    targetId: string;
    viewId?: string;
    title: string;
    description: string;
    position?: "right" | "left" | "top" | "bottom";
}

const TOUR_STEPS: TourStep[] = [
    {
        targetId: "nav-spaces",
        viewId: "spaces",
        title: "Overview",
        description: "Your home base. See new activity and quick stats.",
        position: "right"
    },
    {
        targetId: "create-collection-btn",
        viewId: "spaces",
        title: "Create Collection",
        description: "Start here! Create a Collection to begin organizing testimonials for your products.",
        position: "bottom"
    },
    {
        targetId: "nav-manage-spaces",
        viewId: "manage-spaces",
        title: "Share & Manage",
        description: "Access your collections here. You will find your unique link to share with customers to get feedback.",
        position: "right"
    },
    {
        targetId: "nav-wall",
        viewId: "wall",
        title: "All Reviews",
        description: "Your library of all approved testimonials. Curate the best ones here.",
        position: "right"
    },
    {
        targetId: "nav-widget",
        viewId: "widget",
        title: "Website Embeds",
        description: "Design how these reviews look on your website and get the code to copy-paste.",
        position: "right"
    },
    {
        targetId: "nav-settings",
        viewId: "settings",
        title: "Settings",
        description: "Update your profile and account preferences.",
        position: "right"
    }
];

export const ProductTour = ({ onStepChange }: { onStepChange: (view: any) => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial check - have update later to use localstorage
    useEffect(() => {
        // Updated key to force tour for existing users who might have skipped the old one
        const hasSeenTour = localStorage.getItem("vouchy_tour_forced_v1");
        if (!hasSeenTour) {
            // Small delay to let UI render
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const updateTargetPosition = () => {
        const step = TOUR_STEPS[currentStep];
        const element = document.querySelector(`[data-tour-id="${step.targetId}"]`);

        // Change view if needed
        if (step.viewId) {
            onStepChange(step.viewId);
        }

        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);

            // Highlight effect - add class to target
            document.querySelectorAll(".tour-highlight").forEach(el => el.classList.remove("tour-highlight", "relative", "z-[60]"));
            element.classList.add("tour-highlight", "relative", "z-[60]");
        }
    };

    useEffect(() => {
        if (isVisible) {
            // Wait for render and view change
            setTimeout(updateTargetPosition, 300);
            window.addEventListener("resize", updateTargetPosition);
            // Disable scrolling while tour is active
            document.body.style.overflow = 'hidden';
            return () => {
                window.removeEventListener("resize", updateTargetPosition);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isVisible, currentStep]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            completeTour();
        }
    };

    const completeTour = () => {
        setIsVisible(false);
        localStorage.setItem("vouchy_tour_forced_v1", "true");
        // Cleanup highlights
        document.querySelectorAll(".tour-highlight").forEach(el => el.classList.remove("tour-highlight", "relative", "z-[60]"));
        document.body.style.overflow = 'unset';
    };

    if (!isVisible || !targetRect) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <>
            {/* Backdrop - Blocks interactions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[59] bg-black/60 backdrop-blur-[2px]" // Increased z-index and opacity
                onClick={(e) => e.stopPropagation()} // Prevent clicking through
            />

            {/* Tooltip Card */}
            <motion.div
                layoutId="tour-card"
                className="fixed z-[60] w-80 bg-white rounded-2xl shadow-2xl p-6 border border-zinc-100"
                style={{
                    top: targetRect.top + (targetRect.height / 2) - 80, // Center vertically roughly
                    left: targetRect.right + 20, // To the right
                }}
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Connecting Line/Arrow */}
                <div className="absolute top-20 -left-2 w-4 h-4 bg-white rotate-45 transform border-l border-b border-zinc-100" />

                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#14873e] bg-[#14873e]/10 px-2 py-0.5 rounded-full">
                        Step {currentStep + 1}/{TOUR_STEPS.length}
                    </span>
                </div>

                <h3 className="font-bold text-lg text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    {step.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                        {TOUR_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                    i === currentStep ? "bg-[#14873e]" : "bg-zinc-200"
                                )}
                            />
                        ))}
                    </div>

                    <Button
                        size="sm"
                        onClick={handleNext}
                        className="bg-[#14873e] hover:bg-[#0f6b30] text-white rounded-lg h-9 px-4 text-xs font-bold gap-2 shadow-lg shadow-[#14873e]/20"
                    >
                        {currentStep === TOUR_STEPS.length - 1 ? (
                            <>Finish <Check className="w-3.5 h-3.5" /></>
                        ) : (
                            <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                        )}
                    </Button>
                </div>
            </motion.div>
        </>
    );
};
