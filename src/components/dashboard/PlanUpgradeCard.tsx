import { useState } from "react";
import { TbCheck, TbArrowRight, TbSparkles, TbLoader, TbCrown } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlanUpgradeCardProps {
    currentPlan: string;
    features: {
        testimonialLimit: number;
        activeSpacesLimit: number;
    };
    user: { email?: string; user_metadata?: { full_name?: string } } | null;
}

export const PlanUpgradeCard = ({
    currentPlan,
    features,
    user,
}: PlanUpgradeCardProps) => {
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();

    // Plans data synced exactly with Landing Page Pricing
    const plans = [
        {
            name: "Starter",
            price: "Free",
            period: "",
            description: "Perfect for trying out Vouchy",
            productId: null,
            features: [
                "10 testimonials total",
                "1 active space",
                "Vouchy branding",
            ],
            current: currentPlan === "free",
            popular: false,
            cta: "Current Plan"
        },
        {
            name: "Pro",
            price: "$12",
            period: "/mo",
            description: "The Essential plan for growing businesses",
            productId: "pdt_0NVVmIlZrdWC90xs1ZgOm",
            features: [
                "50 testimonials total",
                "3 active spaces",
                "3 minute video limit",
                "200 AI Magic credits/mo",
                "Teleprompter included",
                "Custom logo branding",
            ],
            current: currentPlan === "pro",
            popular: true,
            cta: "Upgrade to Pro"
        },
        {
            name: "Agency",
            price: "$45",
            period: "/mo",
            description: "The Studio plan for teams & agencies",
            productId: "pdt_0NVVmba1bevOgK6sfV8Wx",
            features: [
                "250 testimonials total",
                "15 active spaces",
                "5 minute video limit",
                "500 AI Magic credits/mo",
                "Full AI Suite access",
                "Full white-label solution",
            ],
            current: currentPlan === "agency",
            popular: false,
            cta: "Upgrade to Agency"
        },
    ];

    const handleUpgrade = async (productId: string, planName: string) => {
        if (!user) return;

        setLoading(planName);
        try {
            // Force get the latest session 
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error("Session error:", sessionError);
                toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description: "Your session has expired. Please log out and log back in.",
                });
                return;
            }

            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    productId,
                    customerEmail: user.email,
                    customerName: user.user_metadata?.full_name || user.email,
                    returnUrl: `${window.location.origin}/dashboard?payment=success`,
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) {
                // Attempt to parse explicit error from function
                let msg = error.message;
                try {
                    // The error object from supabase-js might wrap the response
                    // But usually invoke returns error directly if non-2xx?
                    // Let's rely on standard error handling or data.error if present
                } catch (e) { }

                throw error;
            }

            if (data?.paymentLink) {
                window.location.href = data.paymentLink;
            } else {
                throw new Error(data?.error || 'No payment link received');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            toast({
                variant: "destructive",
                title: "Payment Error",
                description: err instanceof Error ? err.message : "Failed to create checkout session.",
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="organic-card p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg ring-4 ring-zinc-100">
                    <TbCrown className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-2xl text-zinc-900">Your Plan</h3>
                    <p className="text-sm text-zinc-500">Manage your subscription and limits</p>
                </div>
            </div>

            {/* Current Plan Limitations Summary */}
            <div className="mb-8 p-6 bg-white/40 backdrop-blur-sm border border-zinc-200/60 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Status</p>
                        <p className="text-3xl font-bold text-zinc-900 capitalize tracking-tight">{currentPlan} Plan</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Your Usage</p>
                        <p className="text-sm font-medium text-zinc-700 bg-white/60 px-4 py-2 rounded-full border border-zinc-200 inline-block shadow-sm">
                            {features.testimonialLimit} testimonials • {features.activeSpacesLimit} spaces
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Cards Grid (Matching Landing Page Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative p-6 rounded-[1.5rem] bg-background border transition-all duration-300 h-full flex flex-col ${plan.current
                                ? "border-zinc-900/10 bg-zinc-50/50 grayscale opacity-80" // Dim current plan slightly to highlight upgrades? Or highlight it? Let's style it cleanly.
                                : plan.popular
                                    ? "border-primary/50 shadow-xl shadow-primary/5 ring-4 ring-primary/5 z-10 scale-[1.02]"
                                    : "border-border/50 hover:border-primary/20 hover:shadow-lg"
                            } ${plan.current ? "ring-2 ring-zinc-200" : ""}`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && !plan.current && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full shadow-lg">
                                    <TbSparkles className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        Recommended
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Current Plan Badge */}
                        {plan.current && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <div className="px-3 py-1 bg-zinc-200 text-zinc-600 rounded-full shadow-sm border border-zinc-300">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        Current Plan
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                            <p className="text-xs text-muted-foreground mb-4 h-8 leading-snug">{plan.description}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                                <span className="text-muted-foreground font-medium text-sm">{plan.period}</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                            onClick={() => plan.productId && handleUpgrade(plan.productId, plan.name)}
                            disabled={plan.current || loading === plan.name || !plan.productId}
                            className={`w-full group rounded-xl h-10 text-sm font-bold mb-6 ${plan.current
                                    ? "bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-100"
                                    : plan.popular
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                                        : "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50"
                                }`}
                        >
                            {loading === plan.name ? (
                                <TbLoader className="w-4 h-4 animate-spin" />
                            ) : plan.current ? (
                                "Active Plan"
                            ) : (
                                <>
                                    {plan.cta}
                                    <TbArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>

                        {/* Features List */}
                        <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Includes:</p>
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2.5">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.current ? "bg-zinc-200" : "bg-green-500/10"
                                            }`}>
                                            <TbCheck className={`w-3 h-3 ${plan.current ? "text-zinc-500" : "text-green-600"
                                                }`} />
                                        </div>
                                        <span className={`text-sm font-medium leading-snug ${plan.current ? "text-muted-foreground" : "text-foreground/80"
                                            }`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
