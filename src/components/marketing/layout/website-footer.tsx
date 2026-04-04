"use client";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Loader2,
  Globe,
  MapPin,
  ExternalLink,
  Zap,
} from "lucide-react";
import SocialIcons from "./social-icons";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useNewsletter } from "@/hooks/use-newsletter";
import {
  nepdoraAddress,
  nepdoraEmail,
  nepdoraPhone,
} from "@/constants/contact";
import Image from "next/image";
import Link from "next/link";
import { NEPAL_CITIES, SERVICE_CATEGORIES } from "@/constants/nepal-cities";

export const WebsiteFooter = () => {
  const pathname = usePathname();
  // Find which category we are currently in
  const isEcommerceRoute =
    pathname.includes("ecommerce") || pathname.includes("ecommerce-website");

  const activeCategory =
    SERVICE_CATEGORIES.find(cat => pathname.includes(cat.slug)) ||
    (isEcommerceRoute ? SERVICE_CATEGORIES[0] : SERVICE_CATEGORIES[2]);

  // Take first 12 cities for more density, or all
  const displayedCities = NEPAL_CITIES.slice(0, 18);

  return (
    <div className="overflow-hidden border-t border-gray-200 bg-white px-4 pt-16 pb-8 font-sans text-gray-900 sm:px-6 md:px-10 lg:px-20">
      <footer className="mx-auto max-w-7xl">
        <div className="px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Brand & Mission */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="mb-6 inline-block">
                <Image
                  src="/nepdora-logooo.svg"
                  alt="Nepdora Logo"
                  width={180}
                  height={40}
                  className="h-auto"
                />
              </Link>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
                Empowering local businesses across Nepal to build their dream
                digital presence. Our specialized website solutions are tailored
                for distinct local markets, ensuring your business stands out
                where it matters most.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <span>{nepdoraAddress}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Globe size={18} className="text-primary shrink-0" />
                  <span>{nepdoraEmail}</span>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Service Links */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              {/* Specialized E-commerce Ecosystem for Ecommerce pages */}
              {isEcommerceRoute && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h4 className="mb-4 flex items-center font-bold text-gray-900">
                    E-commerce Ecosystem
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/khalti-payment-gateway-nepal"
                        className="group flex items-center text-xs text-blue-600 hover:underline"
                      >
                        Khalti Integration Guide <ExternalLink size={12} className="ml-1" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/esewa-integration-guide-nepal"
                        className="group flex items-center text-xs text-green-600 hover:underline"
                      >
                        eSewa Implementation <ExternalLink size={12} className="ml-1" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/solutions/local-delivery-integration-pathao"
                        className="group flex items-center text-xs text-orange-600 hover:underline"
                      >
                        Pathao Parcel Delivery <ExternalLink size={12} className="ml-1" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/pricing"
                        className="group flex items-center text-xs text-gray-500 hover:underline"
                      >
                        Pricing & Plans
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/templates/ecommerce"
                        className="group flex items-center text-xs text-gray-500 hover:underline"
                      >
                        E-commerce Templates
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}

              {/* Authority Hubs Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="mb-4 flex items-center font-bold text-gray-900 italic uppercase tracking-tighter">
                  Authority Hubs
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/integrations" className="group flex items-center text-xs text-gray-500 hover:text-primary transition-colors">
                      Integrations Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link href="/industries" className="group flex items-center text-xs text-gray-500 hover:text-primary transition-colors">
                      Industry Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="/switch" className="group flex items-center text-xs text-gray-500 hover:text-primary transition-colors">
                      Migration Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/showcase" className="group flex items-center text-xs text-gray-500 hover:text-primary transition-colors">
                      Customer Showcase
                    </Link>
                  </li>
                  <li>
                    <Link href="/experts" className="group flex items-center text-xs text-gray-500 hover:text-primary transition-colors">
                      Verified Experts
                    </Link>
                  </li>
                  <li>
                    <Link href="/learn" className="group flex items-center text-xs text-gray-500 hover:text-primary transition-colors">
                      Growth Academy
                    </Link>
                  </li>
                  <li>
                    <Link href="/best/ecommerce-platforms-in-nepal-2026" className="group flex items-center text-xs text-primary font-bold hover:underline">
                      Best E-commerce (2026) <Zap className="w-3 h-3 ml-1 fill-primary" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/best/website-builders-for-restaurants-kathmandu" className="group flex items-center text-xs text-primary font-bold hover:underline">
                      Best for Restaurants <Zap className="w-3 h-3 ml-1 fill-primary" />
                    </Link>
                  </li>
                </ul>
              </motion.div>

              {/* Growth Resources Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="mb-4 flex items-center font-bold text-gray-900 italic uppercase tracking-tighter">
                  Growth Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/pricing/nepdora-vs-shopify-cost-comparison"
                      className="group flex items-center text-xs text-gray-500 hover:underline"
                    >
                      Nepdora vs Global Builders (Shopify/Wix)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/alternative/blanxer-nepal"
                      className="group flex items-center text-xs text-gray-500 hover:underline"
                    >
                      Compare with Blanxer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/payment-gateways-nepal"
                      className="group flex items-center text-xs text-gray-500 hover:underline"
                    >
                      Payment Gateways Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-to-register-business-nepal"
                      className="group flex items-center text-xs text-gray-500 hover:underline"
                    >
                      Business Registration Path
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="group flex items-center text-xs text-gray-500 hover:underline"
                    >
                      Marketing Blog
                    </Link>
                  </li>
                </ul>
              </motion.div>

              {SERVICE_CATEGORIES.filter(
                (c, i, a) =>
                  a.findIndex(t => t.name === c.name) === i && // Unique names
                  !(isEcommerceRoute && c.slug.includes("ecommerce")) // Avoid duplication if we already show the ecosystem
              )
                .slice(0, isEcommerceRoute ? 2 : 3)
                .map((category, idx) => (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h4 className="mb-4 -ml-1 flex items-center font-bold text-gray-900">
                      {category.name} in Cities
                    </h4>
                    <ul className="space-y-2">
                      {displayedCities.slice(0, 8).map(city => (
                        <li key={`${category.slug}-${city}`}>
                          <Link
                            href={`/${category.slug}/${city.toLowerCase()}`}
                            className="group flex items-center text-xs text-gray-500 hover:underline"
                          >
                            {category.name} in {city}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Dense City Grid for SEO */}
          <motion.div
            className="mt-16 border-t border-gray-100 pt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 text-sm font-bold tracking-wider text-gray-900">
              Explore Website Solutions by Region
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {NEPAL_CITIES.slice(0, 500).map(city => (
                <Link
                  key={city}
                  href={`/${activeCategory.slug}/${city.toLowerCase()}`}
                  className="text-[11px] font-medium text-gray-400 hover:underline"
                >
                  {activeCategory.name} in {city}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Footer Bottom */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 md:flex-row">
            <div className="flex flex-col items-center gap-6 text-xs text-gray-500 md:flex-row">
              <p>
                © {new Date().getFullYear()} Nepdora Pvt. Ltd. All rights
                reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/privacy-policy" className="hover:text-black">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-black">
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Built with</span>
              <Link 
                href="/" 
                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black text-white transition-all hover:scale-105 hover:bg-primary uppercase tracking-tighter"
              >
                Nepdora
              </Link>
            </div>
            <SocialIcons />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteFooter;
