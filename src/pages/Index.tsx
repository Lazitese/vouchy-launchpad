import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import SocialProof from "@/components/SocialProof";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <BentoGrid />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
