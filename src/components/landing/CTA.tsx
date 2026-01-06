import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-32 px-6 bg-primary relative overflow-hidden" ref={ref}>
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 grid grid-cols-12 gap-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-l border-primary-foreground/20 h-full" />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-6 gap-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-t border-primary-foreground/20 w-full" />
          ))}
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border border-primary-foreground/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 border border-primary-foreground/10 rounded-full"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[12px] font-medium text-primary-foreground/60 uppercase tracking-[0.2em] mb-6">
              Ready to start?
            </span>
          </motion.div>

          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={isInView ? { clipPath: "inset(0 0 0% 0)" } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.06em] text-primary-foreground">
              Start collecting
              <br />
              testimonials today
            </h2>
          </motion.div>

          <motion.p
            className="text-lg text-primary-foreground/70 leading-relaxed mb-10 max-w-lg mx-auto"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={isInView ? { clipPath: "inset(0 0 0% 0)" } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Join thousands of businesses using Vouchy to turn customer
            voices into their most powerful growth engine.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              size="lg"
              className="group rounded-[4px] h-14 px-10 text-[13px] uppercase tracking-[0.1em] font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <span className="text-sm text-primary-foreground/50">
              No credit card required
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
