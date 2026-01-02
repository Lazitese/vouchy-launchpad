import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  index: number;
}

const TestimonialCard = ({ name, role, company, content, index }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="editorial-card p-8 h-full flex flex-col"
    >
      {/* Editorial number */}
      <span className="text-[11px] font-medium text-foreground/30 uppercase tracking-widest mb-8">
        0{index + 1}
      </span>
      
      {/* Quote */}
      <p className="text-lg text-foreground leading-relaxed flex-grow mb-8">
        "{content}"
      </p>
      
      {/* Divider */}
      <div className="w-8 h-px bg-border/[0.15] mb-6" />
      
      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-primary text-sm tracking-tight">{name}</p>
          <p className="text-[13px] text-subtext">{role}</p>
        </div>
        <span className="text-[11px] font-medium text-foreground/40 uppercase tracking-widest">
          {company}
        </span>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
