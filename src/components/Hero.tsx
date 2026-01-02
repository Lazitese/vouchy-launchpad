import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MaskText from "./MaskText";

const stats = [
  { value: "5,000+", label: "Businesses" },
  { value: "2.4M", label: "Testimonials" },
  { value: "98%", label: "Satisfaction" },
];

const Hero = () => {
  return (
    <section className="pt-32 pb-24 px-6 border-b border-border/[0.08]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-end">
          {/* Left: Headline */}
          <div className="lg:col-span-7">
            <MaskText delay={0.1}>
              <span className="text-[13px] font-medium text-foreground/50 uppercase tracking-widest mb-6 block">
                Testimonial Platform
              </span>
            </MaskText>
            
            <MaskText delay={0.2}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-primary mb-8">
                Turn customer
                <br />
                voices into
                <br />
                growth
              </h1>
            </MaskText>
            
            <MaskText delay={0.4}>
              <p className="text-lg text-subtext max-w-md leading-relaxed mb-10">
                Collect, manage, and showcase authentic testimonials 
                that convert visitors into customers.
              </p>
            </MaskText>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <Button 
                size="lg" 
                className="rounded-[4px] text-[13px] uppercase tracking-wide h-12 px-8"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-[4px] text-[13px] uppercase tracking-wide h-12 px-8 border-border/[0.08]"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
          
          {/* Right: Stats */}
          <div className="lg:col-span-5 lg:border-l lg:border-border/[0.08] lg:pl-12">
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <p className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[13px] text-subtext uppercase tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
