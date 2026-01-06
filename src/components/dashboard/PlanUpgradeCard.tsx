import { useState } from "react";
import { Crown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

    const plans = [
        {
            name: "Free",
            price: "$0",
            productId: null,
            features: ["5 testimonials", "1 space", "60s video"],
            current: currentPlan === "free",
        },
        {
            name: "Pro",
            price: "$12/mo",
            productId: "pdt_0NVVmIlZrdWC90xs1ZgOm",
            features: ["50 testimonials", "3 spaces", "3min video", "AI Magic", "Teleprompter"],
            current: currentPlan === "pro",
            popular: true,
        },
        {
            name: "Agency",
            price: "$45/mo",
            productId: "pdt_0NVVmba1bevOgK6sfV8Wx",
            features: ["250 testimonials", "15 spaces", "5min video", "Full AI Suite", "White-label"],
            current: currentPlan === "agency",
        },
    ];

    const handleUpgrade = async (productId: string, planName: string) => {
        if (!user) return;

        setLoading(planName);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                    },
                    body: JSON.stringify({
                        productId,
                        customerEmail: user.email,
                        customerName: user.user_metadata?.full_name || user.email,
                        returnUrl: `${window.location.origin}/dashboard?payment=success`,
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to create checkout session');
            const data = await response.json();

            if (data?.paymentLink) {
                window.location.href = data.paymentLink;
            } else {
                throw new Error('No payment link received');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            toast({
                variant: "destructive",
                title: "Payment Error",
                description: "Failed to create checkout session. Please try again.",
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="p-6 bg-card border border-border/[0.08] rounded-[12px]">
            <div className="flex items-center gap-2 mb-6">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">Your Plan</h3>
            </div>

            {/* Current Plan Status */}
            <div className="mb-6 p-4 bg-slate rounded-[8px]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-subtext">Current Plan</p>
                        <p className="text-xl font-bold text-primary capitalize">{currentPlan}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-subtext">Limits</p>
                        <p className="text-sm text-foreground">
                            {features.testimonialLimit} testimonials • {features.activeSpacesLimit} spaces
                        </p>
                    </div>
                </div>
            </div>

            {/* Plan Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative p-4 rounded-[8px] border transition-all ${plan.current
                            ? "border-primary bg-primary/5"
                            : plan.popular
                                ? "border-primary/50 hover:border-primary"
                                : "border-border/[0.08] hover:border-primary/30"
                            }`}
                    >
                        {plan.popular && !plan.current && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase">
                                    Popular
                                </span>
                            </div>
                        )}

                        <div className="mb-3">
                            <p className="font-semibold text-primary">{plan.name}</p>
                            <p className="text-lg font-bold text-foreground">{plan.price}</p>
                        </div>

                        <ul className="space-y-1 mb-4">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-xs text-subtext">
                                    <Check className="w-3 h-3 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {plan.current ? (
                            <Button variant="outline" size="sm" className="w-full" disabled>
                                Current Plan
                            </Button>
                        ) : plan.productId ? (
                            <Button
                                variant={plan.popular ? "hero" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => handleUpgrade(plan.productId!, plan.name)}
                                disabled={loading === plan.name}
                            >
                                {loading === plan.name ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    `Upgrade to ${plan.name}`
                                )}
                            </Button>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};
