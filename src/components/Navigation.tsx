import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.svg";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/[0.08]"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logoIcon} alt="Vouchy" className="h-12 w-12" />
          </Link>
          
          <ul className="hidden md:flex items-center gap-10">
            <li>
              <a href="/#features" className="text-[13px] font-medium text-foreground/60 hover:text-primary transition-colors tracking-wide uppercase">
                Features
              </a>
            </li>
            <li>
              <a href="/#pricing" className="text-[13px] font-medium text-foreground/60 hover:text-primary transition-colors tracking-wide uppercase">
                Pricing
              </a>
            </li>
          </ul>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[13px] uppercase tracking-wide"
              onClick={() => navigate("/auth")}
            >
              Log in
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-[13px] uppercase tracking-wide rounded-[4px]"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
