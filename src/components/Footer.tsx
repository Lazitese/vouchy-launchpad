import logoPrimary from "@/assets/logo-primary.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-border/[0.08]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="/">
              <img src={logoPrimary} alt="Vouchy" className="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            </a>
            <p className="text-[12px] text-foreground/40">
              © {currentYear} Vouchy. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Twitter", "LinkedIn"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[12px] text-foreground/40 hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
