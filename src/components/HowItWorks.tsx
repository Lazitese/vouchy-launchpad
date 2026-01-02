import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Create your form",
    description: "Design beautiful collection forms in minutes. Customize questions, branding, and style.",
  },
  {
    number: "02",
    title: "Share the link",
    description: "Send to customers via email, embed on your site, or share on social. One link, multiple channels.",
  },
  {
    number: "03",
    title: "Collect & curate",
    description: "Testimonials flow in automatically. Review, approve, and organize with smart tagging.",
  },
  {
    number: "04",
    title: "Embed anywhere",
    description: "Showcase on your website, landing pages, and marketing materials with one click.",
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

        {/* Steps */}
        <div className="relative">
          {/* Connecting line that draws as you scroll */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-primary/20 hidden lg:block"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          
          {/* Animated progress line */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-primary hidden lg:block"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`relative ${index % 2 === 1 ? "lg:mt-32" : ""}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, scale: 0.9 }}
                animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3 + index * 0.4, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <motion.div 
                  className={`bg-background border border-border/[0.08] rounded-[8px] p-8 ${index % 2 === 0 ? "lg:mr-12" : "lg:ml-12"}`}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -20px rgba(26, 63, 100, 0.15)",
                    borderColor: "hsl(var(--primary) / 0.2)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Step number with pulse animation */}
                  <motion.div
                    className="absolute -top-4 left-8 px-4 py-1 bg-primary text-primary-foreground text-[12px] font-bold tracking-wider rounded-[4px]"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.5 + index * 0.4, 
                      type: "spring", 
                      stiffness: 400,
                      damping: 15
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.4 }}
                    >
                      {step.number}
                    </motion.span>
                  </motion.div>

                  <motion.h3 
                    className="text-xl font-bold text-primary mb-3 mt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.4, duration: 0.5 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className="text-subtext leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.4, duration: 0.5 }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>

                {/* Animated dot on timeline with ring effect */}
                <motion.div
                  className={`absolute top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center ${
                    index % 2 === 0 ? "right-0 translate-x-1/2 lg:-right-[1.5rem]" : "left-0 -translate-x-1/2 lg:-left-[1.5rem]"
                  }`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.4, type: "spring", stiffness: 300 }}
                >
                  {/* Outer ring */}
                  <motion.div
                    className="absolute w-6 h-6 rounded-full border border-primary/30"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: [0, 1.5, 1], opacity: [0, 0.5, 0] } : {}}
                    transition={{ 
                      delay: 0.9 + index * 0.4, 
                      duration: 0.8,
                      times: [0, 0.5, 1]
                    }}
                  />
                  {/* Inner dot */}
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </motion.div>

                {/* Connector arrow for mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="lg:hidden flex justify-center my-4"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.4, duration: 0.4 }}
                  >
                    <div className="w-px h-8 bg-primary/20" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
