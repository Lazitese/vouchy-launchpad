import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoPrimary from "@/assets/logo-primary.svg";

const Navigation = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6">
        <div className="grid-12 items-center h-16">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2">
              <img src={logoPrimary} alt="Vouchy" className="h-8 w-8" />
              <span className="font-heading font-bold text-lg text-primary">Vouchy</span>
            </a>
          </div>
          
          <div className="col-span-8 flex justify-center">
            <ul className="flex items-center gap-8">
              <li>
                <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
