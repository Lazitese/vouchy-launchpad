import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-border/[0.08]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/">
              <img src={logoIcon} alt="Vouchy" className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-[12px] text-foreground/40">
              © {currentYear} Vouchy. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-[12px] text-foreground/40 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[12px] text-foreground/40 hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
