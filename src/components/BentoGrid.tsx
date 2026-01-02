import { motion } from "framer-motion";
import { Video, MessageSquareText, BarChart3, ArrowUpRight } from "lucide-react";
import MaskText from "./MaskText";

const features = [
  {
    title: "Video Testimonials",
    description: "Capture authentic video reviews with our embeddable recorder. One-click sharing and HD quality.",
    icon: Video,
    stat: "2.4x",
    statLabel: "Higher engagement",
  },
  {
    title: "Text Reviews",
    description: "Collect written feedback with customizable forms. Smart prompts help customers share impactful stories.",
    icon: MessageSquareText,
    stat: "4.9",
    statLabel: "Average rating",
  },
  {
    title: "Analytics",
    description: "Track performance with real-time insights. Know which testimonials convert and optimize your social proof.",
    icon: BarChart3,
    stat: "+47%",
    statLabel: "Conversion lift",
  },
];

const BentoGrid = () => {
  return (
    <section id="features" className="py-24 px-6 border-b border-border/[0.08]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <MaskText delay={0.1}>
              <span className="text-[13px] font-medium text-foreground/50 uppercase tracking-widest mb-4 block">
                Features
              </span>
            </MaskText>
            <MaskText delay={0.2}>
              <h2 className="text-4xl md:text-5xl text-primary">
                Everything you need
                <br />
                to build trust
              </h2>
            </MaskText>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/[0.08]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-background p-10 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-10">
                <div className="w-12 h-12 border border-border/[0.08] rounded-[4px] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-subtext leading-relaxed mb-10 text-[15px]">
                {feature.description}
              </p>
              
              <div className="pt-6 border-t border-border/[0.08]">
                <p className="text-3xl font-black text-primary tracking-tight mb-1">
                  {feature.stat}
                </p>
                <p className="text-[13px] text-subtext uppercase tracking-wide">
                  {feature.statLabel}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
