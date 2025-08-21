import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-4 w-4" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-4 w-4" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, href: "#" },
  ];

  return (
    <footer className="bg-muted py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <img src="/fulllogo.svg" alt="Nepdora Logo" className="h-10" />
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Build stunning websites in minutes, not days. Everything you need
              to succeed online in one powerful platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="bg-primary/10 text-primary hover:bg-primary flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border border-t pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="text-muted-foreground mb-4 text-sm md:mb-0">
              © {currentYear} Nepdora. All rights reserved.
            </div>
            <div className="text-muted-foreground flex space-x-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
