import { motion } from "framer-motion";
import logoPrimary from "@/assets/logo-primary.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 border-t border-border/[0.08]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Logo + tagline */}
          <div className="lg:col-span-4">
            <motion.a
              href="/"
              className="inline-flex items-center gap-2.5 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={logoPrimary} alt="Vouchy" className="h-7 w-7" />
              <span className="font-heading font-bold text-base tracking-tight text-primary">
                Vouchy
              </span>
            </motion.a>
            <motion.p
              className="text-subtext text-sm leading-relaxed max-w-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              The modern platform for collecting and showcasing 
              authentic customer testimonials.
            </motion.p>
          </div>

          {/* Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { title: "Product", links: ["Features", "Pricing", "Integrations", "API"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Resources", links: ["Docs", "Help", "Status", "Changelog"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                >
                  <h4 className="text-[11px] font-medium text-foreground/40 uppercase tracking-[0.15em] mb-4">
                    {group.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[13px] text-foreground/60 hover:text-primary transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-foreground/40">
            © {currentYear} Vouchy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[12px] text-foreground/40 hover:text-primary transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
