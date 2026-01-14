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
        <div className="organic-card p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md">
                    <Crown className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-black">Your Plan</h3>
                    <p className="text-sm text-gray-500">Manage your subscription</p>
                </div>
            </div>

            {/* Current Plan Status */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-[20px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
                        <p className="text-2xl font-bold text-black capitalize">{currentPlan}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Usage Limits</p>
                        <p className="text-sm font-medium text-black bg-white px-3 py-1.5 rounded-full border border-gray-200 inline-block shadow-sm">
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
                        className={`relative p-6 rounded-[24px] border transition-all duration-300 ${plan.current
                                ? "border-black bg-black text-white ring-4 ring-black/10"
                                : plan.popular
                                    ? "border-[#ccf381] bg-white ring-4 ring-[#ccf381]/20 shadow-lg"
                                    : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
                            }`}
                    >
                        {plan.popular && !plan.current && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-[#ccf381] text-black text-xs font-bold rounded-full uppercase shadow-sm">
                                    Recommended
                                </span>
                            </div>
                        )}

                        <div className="mb-4">
                            <p className={`font-semibold ${plan.current ? 'text-gray-300' : 'text-gray-500'}`}>{plan.name}</p>
                            <p className="text-3xl font-bold tracking-tight">{plan.price}</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className={`flex items-start gap-2 text-sm ${plan.current ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.current ? 'text-[#ccf381]' : 'text-black'}`} />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            {plan.current ? (
                                <Button className="w-full bg-white text-black hover:bg-gray-200 border-none h-10 rounded-xl font-bold" disabled>
                                    Current Plan
                                </Button>
                            ) : plan.productId ? (
                                <Button
                                    className={`w-full h-10 rounded-xl font-bold transition-transform active:scale-95 ${plan.popular
                                            ? "bg-black text-white hover:bg-gray-800 shadow-md"
                                            : "bg-gray-100 text-black hover:bg-gray-200"
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
                                <Button variant="outline" className="w-full rounded-xl" disabled>Free Forever</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
