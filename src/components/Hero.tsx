import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-24 overflow-hidden">
      {/* Animated grid lines background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-12 gap-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="border-l border-border/[0.04] h-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
            />
          ))}
        </div>
        {/* Horizontal lines */}
        <motion.div 
          className="absolute left-0 right-0 top-1/3 border-t border-border/[0.04]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div 
          className="absolute left-0 right-0 top-2/3 border-t border-border/[0.04]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-6 relative z-10">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 border border-border/[0.08] rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[12px] font-medium text-foreground/60 uppercase tracking-[0.2em]">
              Now in Public Beta
            </span>
          </div>
        </motion.div>

        {/* Main headline with staggered character animation */}
        <div className="mb-12">
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(3rem,12vw,9rem)] leading-[0.9] text-primary"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              Collect
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(3rem,12vw,9rem)] leading-[0.9] text-primary"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              testimonials
            </motion.h1>
          </div>
          <div className="overflow-hidden flex items-baseline gap-6">
            <motion.h1
              className="text-[clamp(3rem,12vw,9rem)] leading-[0.9] text-primary"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              that
            </motion.h1>
            <motion.span
              className="text-[clamp(3rem,12vw,9rem)] leading-[0.9] text-primary/20 italic font-normal"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              sell
            </motion.span>
          </div>
        </div>

        {/* Description + CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-lg md:text-xl text-subtext leading-relaxed mb-8 max-w-md">
              The modern platform for collecting video and text testimonials. 
              Embed anywhere. Convert everywhere.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                className="group rounded-[4px] h-14 px-8 text-[13px] uppercase tracking-[0.1em] font-semibold"
              >
                Start for free
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="group rounded-[4px] h-14 px-8 text-[13px] uppercase tracking-[0.1em] font-medium text-foreground/60 hover:text-primary"
              >
                <Play className="w-4 h-4 mr-3 fill-current" />
                Watch demo
              </Button>
            </div>
          </motion.div>

          {/* Floating product preview card */}
          <motion.div
            className="lg:col-span-7 lg:pl-12"
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-slate border border-border/[0.08] rounded-[8px] p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Jane Doe</p>
                      <p className="text-[12px] text-subtext">CEO, TechCorp</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-primary"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4 + i * 0.1 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </div>
                <motion.p
                  className="text-foreground/80 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  "This platform transformed how we collect customer feedback. 
                  The video testimonials have been absolute game-changers for our sales team."
                </motion.p>
              </div>

              {/* Decorative floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 border border-border/[0.08] rounded-[8px] bg-background"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
              >
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-black text-primary">4.9</p>
                    <p className="text-[10px] text-subtext uppercase tracking-wider">Rating</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 px-4 py-2 border border-border/[0.08] rounded-full bg-background"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <span className="text-[12px] font-medium text-primary">+12 new this week</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border border-border/[0.15] rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-primary/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
