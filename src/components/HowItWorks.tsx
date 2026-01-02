import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Share2, Inbox, Code2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create your form",
    description: "Design beautiful collection forms in minutes. Customize questions, branding, and style.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Share the link",
    description: "Send to customers via email, embed on your site, or share on social. One link, multiple channels.",
    icon: Share2,
  },
  {
    number: "03",
    title: "Collect & curate",
    description: "Testimonials flow in automatically. Review, approve, and organize with smart tagging.",
    icon: Inbox,
  },
  {
    number: "04",
    title: "Embed anywhere",
    description: "Showcase on your website, landing pages, and marketing materials with one click.",
    icon: Code2,
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 bg-slate border-y border-border/[0.08]" ref={ref}>
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-px bg-primary/30" />
            <span className="text-[12px] font-medium text-foreground/50 uppercase tracking-[0.2em]">
              How it works
            </span>
            <div className="w-12 h-px bg-primary/30" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl text-primary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Four steps to
            <br />
            <span className="text-primary/30">social proof</span>
          </motion.h2>
        </div>

        {/* Steps - Clean horizontal flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.2 + index * 0.15, 
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              {/* Card */}
              <div className="bg-background border border-border/[0.08] rounded-xl p-6 h-full hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                {/* Icon with meaningful animation */}
                <div className="relative w-14 h-14 mb-5">
                  <div className="absolute inset-0 bg-primary/5 rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {index === 0 && (
                      <motion.div className="relative">
                        <step.icon className="w-6 h-6 text-primary" />
                        <motion.div
                          className="absolute -right-1 -bottom-1 w-2 h-2 bg-primary rounded-full"
                          animate={{ 
                            scale: [0, 1, 1, 0],
                            opacity: [0, 1, 1, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                        />
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-px bg-primary/50"
                          animate={{ scaleX: [0, 1, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
                        />
                      </motion.div>
                    )}
                    {index === 1 && (
                      <motion.div className="relative">
                        <step.icon className="w-6 h-6 text-primary relative z-10" />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-6 h-6 rounded-full border border-primary" />
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        >
                          <div className="w-6 h-6 rounded-full border border-primary" />
                        </motion.div>
                      </motion.div>
                    )}
                    {index === 2 && (
                      <motion.div className="relative">
                        <step.icon className="w-6 h-6 text-primary" />
                        <motion.div
                          className="absolute -top-3 left-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                          animate={{ 
                            y: [0, 12],
                            opacity: [1, 0],
                            scale: [1, 0.5]
                          }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeIn" }}
                        />
                        <motion.div
                          className="absolute -top-2 left-0 w-1 h-1 bg-primary/60 rounded-full"
                          animate={{ 
                            y: [0, 10],
                            x: [0, 4],
                            opacity: [1, 0]
                          }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4, ease: "easeIn" }}
                        />
                        <motion.div
                          className="absolute -top-2 right-0 w-1 h-1 bg-primary/60 rounded-full"
                          animate={{ 
                            y: [0, 10],
                            x: [0, -4],
                            opacity: [1, 0]
                          }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: 0.7, ease: "easeIn" }}
                        />
                      </motion.div>
                    )}
                    {index === 3 && (
                      <motion.div className="relative">
                        <step.icon className="w-6 h-6 text-primary" />
                        <motion.div
                          className="absolute -right-2 top-1/2 -translate-y-1/2 text-[8px] font-mono text-primary/70 font-bold"
                          animate={{ opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                        >
                          {"</>"}
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Step number */}
                <div className="text-[11px] font-bold text-primary/40 tracking-wider mb-2">
                  STEP {step.number}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-primary mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-subtext leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow connector (except last) */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.15 }}
                >
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4 text-primary/30" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
