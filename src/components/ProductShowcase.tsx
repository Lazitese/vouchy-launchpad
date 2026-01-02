import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";

const ProductShowcase = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [5, -5]);

  const features = [
    "Video & text collection",
    "Custom branding",
    "One-click embed",
    "Analytics dashboard",
    "Team collaboration",
    "API access",
  ];

  return (
    <section className="py-32 px-6 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-px bg-primary/30" />
              <span className="text-[12px] font-medium text-foreground/50 uppercase tracking-[0.2em]">
                The Product
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl text-primary mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              One platform,
              <br />
              <span className="text-primary/30">endless possibilities</span>
            </motion.h2>

            <motion.p
              className="text-lg text-subtext leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              From collection to conversion, Vouchy handles everything. 
              No more scattered tools or complex integrations.
            </motion.p>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-5 h-5 rounded-[4px] bg-primary/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Floating cards */}
          <div className="relative h-[500px]">
            {/* Background card */}
            <motion.div
              className="absolute inset-x-8 inset-y-8 bg-slate border border-border/[0.08] rounded-[12px]"
              style={{ y: cardY, rotateZ: cardRotate }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            {/* Main product card */}
            <motion.div
              className="absolute inset-0 bg-background border border-border/[0.08] rounded-[12px] p-8 shadow-[0_32px_64px_-16px_rgba(26,63,100,0.15)]"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-primary uppercase tracking-wider">Live</span>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total", value: "1,247" },
                    { label: "This week", value: "+89" },
                    { label: "Rate", value: "4.9★" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="p-4 bg-slate rounded-[8px]"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    >
                      <p className="text-[11px] text-subtext uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-primary">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Chart mockup */}
                <div className="p-4 bg-slate rounded-[8px]">
                  <div className="flex items-end gap-2 h-24">
                    {[35, 55, 40, 70, 45, 85, 60, 90, 75, 95, 80, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-primary/20 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={isInView ? { height: `${height}%` } : {}}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent items */}
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-slate rounded-[8px]"
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary">
                        {["AB", "CD", "EF"][i]}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-foreground/10 rounded-full w-24 mb-1.5" />
                        <div className="h-1.5 bg-foreground/5 rounded-full w-16" />
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className="text-primary/60 text-[10px]">★</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
