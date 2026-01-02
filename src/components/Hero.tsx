import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check, Sparkles, FileText, Link2, Inbox, Code2, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
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

          {/* Right: Interactive Demo Card */}
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
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">V</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Dashboard</span>
                  </div>
                </div>

                {/* Workflow visualization */}
                <div className="space-y-3 mb-5">
                  {/* Step 1: Create - Form being built */}
                  <motion.div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/50"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/70">Create form</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="h-1 rounded-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: [0, 20, 20] }}
                            transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
                          />
                        ))}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>

                  {/* Step 2: Share - Link being sent out */}
                  <motion.div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/50"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center relative overflow-hidden">
                      <Link2 className="w-4 h-4 relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-primary-foreground/20"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/70">Share link</p>
                      <p className="text-[10px] text-subtext">vouchy.app/c/abc123</p>
                    </div>
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>

                  {/* Step 3: Collect - Testimonials flowing in (ACTIVE) */}
                  <motion.div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20 relative overflow-hidden"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center relative">
                      <Inbox className="w-4 h-4" />
                      {/* Testimonials flowing in */}
                      <motion.div
                        className="absolute -top-2 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 8], opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <Star className="w-2 h-2 text-primary fill-primary" />
                      </motion.div>
                      <motion.div
                        className="absolute -top-1 left-0"
                        animate={{ y: [0, 6], x: [0, 4], opacity: [1, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
                      >
                        <Star className="w-1.5 h-1.5 text-primary fill-primary" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-primary">Collecting...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <motion.span
                          className="text-lg font-bold text-primary"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          247
                        </motion.span>
                        <span className="text-[10px] text-primary/60">testimonials</span>
                      </div>
                    </div>
                    <motion.div
                      className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-[9px] font-medium text-primary">Live</span>
                    </motion.div>
                  </motion.div>

                  {/* Step 4: Embed - Code waiting */}
                  <motion.div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/30"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 text-foreground/30 flex items-center justify-center">
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Code2 className="w-4 h-4" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/30">Embed</p>
                      <p className="text-[10px] text-foreground/20">Ready when you are</p>
                    </div>
                  </motion.div>
                </div>

                {/* Mini testimonial preview */}
                <motion.div
                  className="p-3 bg-background/50 rounded-lg border border-border/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-start gap-2">
                    <motion.div
                      className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      JD
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 + i * 0.1 }}
                          >
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        className="text-[10px] text-foreground/60 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        "This tool changed how we collect feedback..."
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating notification */}
              <motion.div
                className="absolute -top-3 -right-3 bg-background border border-border/10 rounded-xl px-3 py-2 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-[10px] font-medium text-foreground/70">+3 new today</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
