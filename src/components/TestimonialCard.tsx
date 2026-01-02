import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const TestimonialCard = ({ name, role, company, content, rating, avatar }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-card p-8 rounded-2xl testimonial-card border border-border/50"
    >
      <div className="flex items-start gap-4 mb-6">
        <Quote className="w-10 h-10 text-primary/20 flex-shrink-0" />
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
      </div>
      
      <p className="text-foreground text-lg leading-relaxed mb-8">
        "{content}"
      </p>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-lg">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-subtext">{role} at {company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
