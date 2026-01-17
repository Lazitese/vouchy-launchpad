import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoIconLarge from "@/assets/logo-icon-large.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Hero-style background */}
      <div className="absolute inset-0 bg-primary overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_50%)]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footer-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-grid-pattern)" />
          </svg>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative py-16 px-6">
        <div className="container mx-auto">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-4"
            >
              <img
                src={logoIconLarge}
                alt="Vouchy Logo"
                className="h-32 w-auto object-contain mx-auto drop-shadow-2xl"
              />
            </motion.div>

            {/* Brand text with gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-white/80 max-w-md">
                Turning customer voices into your most powerful growth engine
              </p>
            </motion.div>

            {/* Simple legal links */}
            <motion.div
              className="flex items-center gap-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                to="/privacy"
                className="text-white/70 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <Link
                to="/terms"
                className="text-white/70 hover:text-white transition-colors"
              >
                Terms
              </Link>
            </motion.div>

            {/* Copyright with interesting detail */}
            <motion.div
              className="pt-8 border-t border-white/20 w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-xs text-white/60">
                © {currentYear} Vouchy. Crafted with precision for creators worldwide.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
