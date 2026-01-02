import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Marketing",
    company: "TechFlow",
    content: "Vouchy transformed how we collect customer feedback. Our conversion rate increased by 34% after implementing video testimonials on our landing pages.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "StartupLab",
    content: "The analytics dashboard alone is worth the investment. We finally understand which testimonials drive the most engagement and conversions.",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "ScaleUp",
    content: "Setup took 5 minutes. Our customers love how easy it is to leave video reviews. The quality of feedback we receive now is exceptional.",
    rating: 5,
    avatar: "ER",
  },
];

const SocialProof = () => {
  return (
    <section id="testimonials" className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Loved by teams everywhere
          </h2>
          <p className="text-lg text-subtext max-w-xl mx-auto">
            See why thousands of companies trust Vouchy for their testimonial needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
