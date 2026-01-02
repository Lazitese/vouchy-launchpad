import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out Vouchy",
    features: [
      "1 collection space",
      "Up to 10 testimonials",
      "Basic embed widget",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For growing businesses",
    features: [
      "Unlimited spaces",
      "Unlimited testimonials",
      "Custom branding",
      "Video testimonials",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/mo",
    description: "For teams & agencies",
    features: [
      "Everything in Pro",
      "White-label solution",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    navigate("/auth", { state: { plan: planName, mode: "signup" } });
  };

  return (
    <section className="py-32 px-6 bg-slate" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-12 h-px bg-primary/30" />
            <span className="text-[12px] font-medium text-foreground/50 uppercase tracking-[0.2em]">
              Pricing
            </span>
            <div className="w-12 h-px bg-primary/30" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl text-primary mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Simple, transparent pricing
          </motion.h2>

          <motion.p
            className="text-lg text-subtext max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            No hidden fees. No surprises. Cancel anytime.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 rounded-[12px] bg-background border transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-[0_24px_48px_-12px_rgba(26,63,100,0.2)]"
                  : "border-border/[0.08] hover:border-primary/20"
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-subtext mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-primary">
                    {plan.price}
                  </span>
                  <span className="text-subtext">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-[4px] bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={() => handleSelectPlan(plan.name)}
                variant={plan.popular ? "hero" : "heroOutline"}
                className="w-full group"
                size="lg"
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
