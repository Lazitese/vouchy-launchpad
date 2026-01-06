import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoIcon from "@/assets/logo-icon.svg";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

          {/* Desktop Menu */}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-[13px] uppercase tracking-wide"
              onClick={() => navigate("/auth", { state: { mode: "login" } })}
            >
              Log in
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-[13px] uppercase tracking-wide rounded-[4px]"
              onClick={() => navigate("/auth", { state: { mode: "signup" } })}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/[0.08] bg-background/95 backdrop-blur-sm overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-6">
              <ul className="flex flex-col gap-4">
                <li>
                  <a
                    href="/#features"
                    className="block text-sm font-medium text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#pricing"
                    className="block text-sm font-medium text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    Pricing
                  </a>
                </li>
              </ul>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/[0.08]">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[13px] uppercase tracking-wide px-0"
                  onClick={() => {
                    navigate("/auth", { state: { mode: "login" } });
                    setIsOpen(false);
                  }}
                >
                  Log in
                </Button>
                <Button
                  variant="default"
                  className="w-full text-[13px] uppercase tracking-wide rounded-[4px]"
                  onClick={() => {
                    navigate("/auth", { state: { mode: "signup" } });
                    setIsOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
