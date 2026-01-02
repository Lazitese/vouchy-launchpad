import { motion, useInView } from "framer-motion";
import { Video, MessageSquareText, BarChart3, Zap, Globe, Shield, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    title: "Video Testimonials",
    description: "HD recording in-browser. No downloads. One-click capture that works everywhere.",
    icon: Video,
    size: "large",
    visual: (
      <div className="relative h-full min-h-[200px] flex items-center justify-center">
        <motion.div
          className="w-32 h-32 rounded-[8px] bg-primary/5 border border-border/[0.08] flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-0 h-0 border-l-[8px] border-l-primary-foreground border-y-[6px] border-y-transparent ml-1" />
          </motion.div>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Text Reviews",
    description: "Smart forms with AI prompts that help customers write compelling stories.",
    icon: MessageSquareText,
    size: "medium",
    visual: (
      <div className="space-y-2 mt-6">
        {[85, 60, 75].map((width, i) => (
          <motion.div
            key={i}
            className="h-2 bg-primary/10 rounded-full"
            style={{ width: `${width}%` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    ),
  },
  {
    title: "Real-time Analytics",
    description: "Track views, conversions, and engagement. Know what works.",
    icon: BarChart3,
    size: "medium",
    visual: (
      <div className="flex items-end gap-2 h-20 mt-6">
        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-primary/20 rounded-t-sm origin-bottom"
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: `${height}%`, opacity: 1 }}
            whileHover={{ 
              height: `${Math.min(height + 15, 100)}%`,
              backgroundColor: "hsl(var(--primary) / 0.4)",
            }}
            viewport={{ once: true }}
            transition={{ 
              delay: 0.2 + i * 0.08, 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1],
              height: { type: "spring", stiffness: 300, damping: 20 }
            }}
          />
        ))}
      </div>
    ),
  },
  {
    title: "Instant Embed",
    description: "Drop testimonials anywhere with a single line of code.",
    icon: Globe,
    size: "small",
  },
  {
    title: "Lightning Fast",
    description: "Sub-100ms load times. Never slow down your site.",
    icon: Zap,
    size: "small",
  },
  {
    title: "Enterprise Security",
    description: "SOC2 compliant. Your data is protected.",
    icon: Shield,
    size: "small",
  },
];

const BentoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-32 px-6" ref={ref}>
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-px bg-primary/30" />
            <span className="text-[12px] font-medium text-foreground/50 uppercase tracking-[0.2em]">
              Features
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl text-primary"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Built for
              <br />
              <span className="text-primary/30">modern teams</span>
            </motion.h2>
            <motion.p
              className="text-lg text-subtext leading-relaxed self-end max-w-md"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Everything you need to collect, manage, and showcase authentic 
              customer testimonials that actually convert.
            </motion.p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Large card - Video */}
          <motion.div
            className="md:col-span-2 lg:row-span-2 group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-full bg-slate border border-border/[0.08] rounded-[8px] p-8 relative overflow-hidden transition-all duration-500 hover:border-border/[0.15]">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 border border-border/[0.08] rounded-[4px] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <Video className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">{features[0].title}</h3>
                <p className="text-subtext leading-relaxed">{features[0].description}</p>
              </div>
              {features[0].visual}
            </div>
          </motion.div>

          {/* Medium cards */}
          {features.slice(1, 3).map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full bg-slate border border-border/[0.08] rounded-[8px] p-6 relative overflow-hidden transition-all duration-500 hover:border-border/[0.15]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 border border-border/[0.08] rounded-[4px] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <feature.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-subtext leading-relaxed">{feature.description}</p>
                {feature.visual}
              </div>
            </motion.div>
          ))}

          {/* Small cards */}
          {features.slice(3).map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full bg-background border border-border/[0.08] rounded-[8px] p-6 relative overflow-hidden transition-all duration-500 hover:bg-slate hover:border-border/[0.15]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-9 h-9 border border-border/[0.08] rounded-[4px] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <feature.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-primary">{feature.title}</h3>
                </div>
                <p className="text-sm text-subtext leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
