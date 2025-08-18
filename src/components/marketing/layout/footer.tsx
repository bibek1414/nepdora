import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF className="w-4 h-4" />, href: "#" },
    { name: "Instagram", icon: <FaInstagram className="w-4 h-4" />, href: "#" },
    { name: "LinkedIn", icon: <FaLinkedinIn className="w-4 h-4" />, href: "#" },
    { name: "WhatsApp", icon: <FaWhatsapp className="w-4 h-4" />, href: "#" },
  ];

  return (
    <footer className="bg-muted py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="Nepdora Logo" className="h-10" />
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
                  className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
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
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
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

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {currentYear} Nepdora. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
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
