import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-3 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Now in Public Beta
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-primary">Collect testimonials</span>
                <br />
                <span className="text-primary/40">that convert</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-subtext leading-relaxed mb-8 max-w-md"
            >
              The modern way to collect, manage and showcase video & text testimonials. Embed anywhere in minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <Button
                size="lg"
                className="group h-12 px-6 rounded-full text-sm font-semibold"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="group h-12 px-6 rounded-full text-sm font-medium text-foreground/60 hover:text-primary"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-6 text-sm text-subtext"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Setup in 2 min</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Compact Product Card */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative max-w-sm mx-auto lg:ml-auto lg:mr-0">
              {/* Main card */}
              <div className="bg-slate/50 backdrop-blur-sm border border-border/10 rounded-2xl p-5 shadow-2xl shadow-primary/5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">V</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Vouchy</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-green-600">Live</span>
                  </div>
                </div>

                {/* Steps - Compact */}
                <div className="space-y-2 mb-4">
                  {[
                    { label: "Create form", done: true },
                    { label: "Share link", done: true },
                    { label: "Collect", active: true },
                    { label: "Embed", done: false },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        item.active 
                          ? "bg-primary/10 border border-primary/20" 
                          : "bg-background/50"
                      }`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        item.done 
                          ? "bg-primary text-primary-foreground" 
                          : item.active 
                            ? "bg-primary/20 text-primary" 
                            : "bg-foreground/5 text-foreground/30"
                      }`}>
                        {item.done ? "✓" : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${
                        item.active ? "text-primary" : item.done ? "text-foreground/70" : "text-foreground/30"
                      }`}>
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <div>
                    <p className="text-lg font-bold text-primary">247</p>
                    <p className="text-[10px] text-subtext">Collected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">98%</p>
                    <p className="text-[10px] text-subtext">Completion</p>
                  </div>
                </div>
              </div>

              {/* Floating accent */}
              <motion.div
                className="absolute -bottom-3 -right-3 bg-background border border-border/10 rounded-xl px-3 py-2 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-primary">{"</>"}</span>
                  </div>
                  <span className="text-[10px] font-medium text-foreground/70">Ready to embed</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
