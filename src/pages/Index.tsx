import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import TestimonialDesigns from "@/components/landing/TestimonialDesigns";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/layout/Footer";

import HowItWorks from "@/components/landing/HowItWorks";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SEOHead } from "@/components/SEO/SEOHead";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        addSoftwareSchema={true}
        title="Vouchy Launchpad | Collect Authentic Video Testimonials"
      />
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
