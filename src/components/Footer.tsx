import logoPrimary from "@/assets/logo-primary.svg";

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img src={logoPrimary} alt="Vouchy" className="h-8 w-8" />
              <span className="font-heading font-bold text-lg text-primary">Vouchy</span>
            </a>
            <p className="text-subtext text-sm leading-relaxed">
              Turn customer voices into your most powerful growth engine.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-subtext">
            © 2026 Vouchy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-subtext hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-sm text-subtext hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="text-sm text-subtext hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
