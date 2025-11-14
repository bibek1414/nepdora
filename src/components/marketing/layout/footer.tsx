import React from "react";
import { Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
  ];

  const productLinks = [
    { name: "Features", href: "#" },
    { name: "Templates", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "API", href: "#" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Status", href: "#" },
    { name: "Community", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="relative border-t border-gray-100 bg-white">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/30" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Brand section */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <img src="/fulllogo.svg" alt="Nepdora" className="h-8 w-auto" />
              </div>
              <p className="mb-8 max-w-md text-base leading-relaxed text-gray-600">
                Build stunning websites in minutes, not days. Everything you
                need to succeed online in one powerful platform.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ name, icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={name}
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-gray-900 hover:text-white"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {/* Product */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-900 uppercase">
                    Product
                  </h3>
                  <ul className="space-y-3">
                    {productLinks.map(({ name, href }) => (
                      <li key={name}>
                        <a
                          href={href}
                          className="group inline-flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900"
                        >
                          {name}
                          <ArrowUpRight className="ml-1 h-3 w-3 translate-x-1 -translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-900 uppercase">
                    Support
                  </h3>
                  <ul className="space-y-3">
                    {supportLinks.map(({ name, href }) => (
                      <li key={name}>
                        <a
                          href={href}
                          className="group inline-flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900"
                        >
                          {name}
                          <ArrowUpRight className="ml-1 h-3 w-3 translate-x-1 -translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-900 uppercase">
                    Stay Updated
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Get the latest updates and news.
                  </p>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                    <button className="absolute top-1.5 right-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-gray-800">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              © {currentYear} Nepdora. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {legalLinks.map(({ name, href }) => (
                <a
                  key={name}
                  href={href}
                  className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-900"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
