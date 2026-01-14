import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import TestimonialDesigns from "@/components/landing/TestimonialDesigns";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/layout/Footer";

import HowItWorks from "@/components/landing/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <BentoGrid />
        <HowItWorks />
        <TestimonialDesigns />
        <ProductShowcase />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
