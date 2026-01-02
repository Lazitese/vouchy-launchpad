import MaskText from "./MaskText";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Marketing",
    company: "TechFlow",
    content: "Vouchy transformed how we collect customer feedback. Our conversion rate increased by 34% after implementing video testimonials on our landing pages.",
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "StartupLab",
    content: "The analytics dashboard alone is worth the investment. We finally understand which testimonials drive the most engagement and conversions.",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "ScaleUp",
    content: "Setup took 5 minutes. Our customers love how easy it is to leave video reviews. The quality of feedback we receive now is exceptional.",
  },
];

const SocialProof = () => {
  return (
    <section id="testimonials" className="py-24 px-6 bg-slate border-y border-border/[0.08]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <MaskText delay={0.1}>
              <span className="text-[13px] font-medium text-foreground/50 uppercase tracking-widest mb-4 block">
                Testimonials
              </span>
            </MaskText>
            <MaskText delay={0.2}>
              <h2 className="text-4xl md:text-5xl text-primary">
                Loved by
                <br />
                teams
                <br />
                everywhere
              </h2>
            </MaskText>
          </div>
          <div className="lg:col-span-8 lg:flex lg:items-end lg:justify-end">
            <MaskText delay={0.3}>
              <p className="text-lg text-subtext max-w-md leading-relaxed lg:text-right">
                See why thousands of companies trust Vouchy for their testimonial and social proof needs.
              </p>
            </MaskText>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
