import { useState } from "react";
import { Crown, Check, Loader2 } from "lucide-react";
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

    const plans = [
        {
            name: "Free",
            price: "$0",
            productId: null,
            features: ["10 testimonials", "1 space", "60s video"],
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
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    productId,
                    customerEmail: user.email,
                    customerName: user.user_metadata?.full_name || user.email,
                    returnUrl: `${window.location.origin}/dashboard?payment=success`,
                },
            });

            if (error) throw error;

            if (data?.paymentLink) {
                window.location.href = data.paymentLink;
            } else {
                throw new Error(data?.error || 'No payment link received');
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
        <div className="organic-card p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg ring-4 ring-zinc-100">
                    <Crown className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="font-bold text-2xl text-zinc-900">Your Plan</h3>
                    <p className="text-sm text-zinc-500">Manage your subscription and limits</p>
                </div>
            </div>

            {/* Current Plan Status */}
            <div className="mb-8 p-6 bg-white/40 backdrop-blur-sm border border-zinc-200/60 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Plan</p>
                        <p className="text-3xl font-bold text-zinc-900 capitalize tracking-tight">{currentPlan}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Usage Limits</p>
                        <p className="text-sm font-medium text-zinc-700 bg-white/60 px-4 py-2 rounded-full border border-zinc-200 inline-block shadow-sm">
                            {features.testimonialLimit} testimonials • {features.activeSpacesLimit} spaces
                        </p>
                    </div>
                </div>
            </div>

            {/* Plan Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 ${plan.current
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-900/10"
                            : plan.popular
                                ? "border-zinc-200 bg-white/80 backdrop-blur-xl shadow-lg hover:-translate-y-1"
                                : "border-zinc-200/60 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-zinc-300 hover:shadow-md"
                            }`}
                    >
                        {plan.popular && !plan.current && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                                    Recommended
                                </span>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className={`font-medium mb-1 ${plan.current ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.name}</p>
                            <p className="text-3xl font-bold tracking-tight">{plan.price}</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <li key={feature} className={`flex items-start gap-3 text-sm ${plan.current ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.current ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                        <Check className={`w-3 h-3 ${plan.current ? 'text-white' : 'text-zinc-900'}`} strokeWidth={2} />
                                    </div>
                                    <span className="leading-tight mt-0.5">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            {plan.current ? (
                                <Button className="w-full bg-white/10 text-white hover:bg-white/20 border-none h-11 rounded-xl font-bold" disabled>
                                    Current Plan
                                </Button>
                            ) : plan.productId ? (
                                <Button
                                    className={`w-full h-11 rounded-xl font-bold transition-all active:scale-95 ${plan.popular
                                        ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10"
                                        : "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                                        }`}
                                    onClick={() => handleUpgrade(plan.productId!, plan.name)}
                                    disabled={loading === plan.name}
                                >
                                    {loading === plan.name ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        `Upgrade`
                                    )}
                                </Button>
                            ) : (
                                <Button variant="ghost" className="w-full rounded-xl hover:bg-zinc-100 text-zinc-500" disabled>Free Forever</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
