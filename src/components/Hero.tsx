import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {

  return (
    <section className="relative min-h-screen pt-24 overflow-hidden">
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

      <div className="container mx-auto px-6 relative z-10">
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
              {/* How it works preview */}
              <div className="bg-slate border border-border/[0.08] rounded-[8px] p-6 md:p-8">
                {/* Browser header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/[0.08]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-5 bg-background border border-border/[0.08] rounded-full px-3 flex items-center">
                      <span className="text-[10px] text-subtext">vouchy.app/collect</span>
                    </div>
                  </div>
                </div>

                {/* Step flow */}
                <div className="space-y-4">
                  {[
                    { step: "01", label: "Create form", done: true },
                    { step: "02", label: "Share link", done: true },
                    { step: "03", label: "Collect", active: true },
                    { step: "04", label: "Embed", done: false },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      className={`flex items-center gap-4 p-3 rounded-[6px] transition-all ${
                        item.active 
                          ? "bg-primary/5 border border-primary/20" 
                          : "bg-background border border-border/[0.08]"
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + i * 0.15 }}
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-[4px] flex items-center justify-center text-[11px] font-bold ${
                          item.done 
                            ? "bg-primary text-primary-foreground" 
                            : item.active 
                              ? "bg-primary/20 text-primary border border-primary/30" 
                              : "bg-foreground/5 text-foreground/40"
                        }`}
                        animate={item.active ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {item.done ? "✓" : item.step}
                      </motion.div>
                      <span className={`text-sm font-medium ${
                        item.active ? "text-primary" : item.done ? "text-foreground/70" : "text-foreground/40"
                      }`}>
                        {item.label}
                      </span>
                      {item.active && (
                        <motion.div
                          className="ml-auto flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.8 }}
                        >
                          <motion.div
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[11px] text-primary font-medium">Live</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <motion.div
                  className="mt-6 pt-4 border-t border-border/[0.08]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] text-subtext">Collection progress</span>
                    <span className="text-[11px] font-medium text-primary">75%</span>
                  </div>
                  <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ delay: 2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Floating stats card */}
              <motion.div
                className="absolute -top-4 -right-4 w-28 border border-border/[0.08] rounded-[8px] bg-background p-3"
                initial={{ opacity: 0, x: 20, rotate: 3 }}
                animate={{ opacity: 1, x: 0, rotate: 3 }}
                transition={{ delay: 1.5 }}
              >
                <div className="text-center">
                  <motion.p 
                    className="text-2xl font-black text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    247
                  </motion.p>
                  <p className="text-[10px] text-subtext uppercase tracking-wider">Collected</p>
                </div>
              </motion.div>

              {/* Floating embed preview */}
              <motion.div
                className="absolute -bottom-4 -left-4 border border-border/[0.08] rounded-[8px] bg-background px-4 py-3"
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ delay: 1.6 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-primary">{"</>"}</span>
                  </div>
                  <span className="text-[11px] font-medium text-primary">Ready to embed</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

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
