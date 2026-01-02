import { motion } from "framer-motion";
import { Video, MessageSquareText, BarChart3, Play, Star, TrendingUp } from "lucide-react";

const features = [
  {
    title: "Video Testimonials",
    description: "Capture authentic video reviews with our embeddable recorder. One-click sharing, automatic transcription, and HD quality.",
    icon: Video,
    highlight: (
      <div className="flex items-center gap-3 mt-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Play className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">2.4x</p>
          <p className="text-sm text-subtext">Higher engagement</p>
        </div>
      </div>
    ),
  },
  {
    title: "Text Reviews",
    description: "Collect written feedback with customizable forms. Smart prompts help customers share impactful stories.",
    icon: MessageSquareText,
    highlight: (
      <div className="flex items-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-6 h-6 fill-primary text-primary" />
        ))}
        <span className="ml-2 text-sm font-medium text-subtext">4.9 avg rating</span>
      </div>
    ),
  },
  {
    title: "Analytics",
    description: "Track performance with real-time insights. Know which testimonials convert and optimize your social proof.",
    icon: BarChart3,
    highlight: (
      <div className="flex items-center gap-3 mt-6">
        <TrendingUp className="w-8 h-8 text-primary" />
        <div>
          <p className="text-2xl font-bold text-primary">+47%</p>
          <p className="text-sm text-subtext">Conversion lift</p>
        </div>
      </div>
    ),
  },
];

const BentoGrid = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Everything you need to build trust
          </h2>
          <p className="text-lg text-subtext max-w-xl mx-auto">
            A complete toolkit for collecting, managing, and showcasing customer testimonials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300 testimonial-card"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-subtext leading-relaxed">
                {feature.description}
              </p>
              
              {feature.highlight}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
