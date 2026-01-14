import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { TbMenu2, TbX } from "react-icons/tb";
import logoIcon from "@/assets/logo-icon.svg";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { label: "Features", id: "features" },
    { label: "How it works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50"
    >
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-muted" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Logo</span>
          </div>

          {/* Centered nav links placeholder */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {['Features', 'How it works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right CTAs placeholder */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary/80 transition-colors"
              onClick={() => navigate("/auth", { state: { mode: "login" } })}
            >
              Sign In
            </button>
            <button 
              className="px-6 py-2 rounded-full bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg"
              onClick={() => navigate("/auth", { state: { mode: "signup" } })}
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button placeholder */}
          <button className="md:hidden p-2">
            <div className="w-6 h-0.5 bg-foreground mb-1.5" />
            <div className="w-6 h-0.5 bg-foreground mb-1.5" />
            <div className="w-6 h-0.5 bg-foreground" />
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <ul className="flex flex-col gap-4">
                {['Features', 'How it works', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block text-lg font-semibold text-foreground/80 hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 pt-6 border-t border-border/40">
                <button
                  className="w-full justify-center rounded-xl h-12 text-base font-medium border-2 border-border hover:bg-secondary/80 transition-colors"
                  onClick={() => {
                    navigate("/auth", { state: { mode: "login" } });
                    setIsOpen(false);
                  }}
                >
                  Sign In
                </button>
                <button
                  className="w-full justify-center rounded-xl h-12 text-base font-bold bg-foreground text-background shadow-lg shadow-foreground/20"
                  onClick={() => {
                    navigate("/auth", { state: { mode: "signup" } });
                    setIsOpen(false);
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
