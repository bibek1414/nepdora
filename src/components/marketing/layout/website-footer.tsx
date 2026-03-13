"use client";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Loader2,
  Globe,
  MapPin,
  ExternalLink,
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
  // Find which category we are currently in, default to agency-website
  const activeCategory =
    SERVICE_CATEGORIES.find(cat => pathname.includes(cat.slug)) ||
    SERVICE_CATEGORIES[1];

  // Take first 12 cities for more density, or all
  const displayedCities = NEPAL_CITIES.slice(0, 18);

  return (
    <footer className="w-full overflow-hidden border-t border-gray-200 bg-white px-4 pt-16 pb-8 font-sans text-gray-900 sm:px-6 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
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
            {SERVICE_CATEGORIES.slice(0, 3).map((category, idx) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="mb-4 flex items-center font-bold text-gray-900">
                  {category.name} in Cities
                </h4>
                <ul className="space-y-2">
                  {displayedCities.slice(0, 8).map(city => (
                    <li key={`${category.slug}-${city}`}>
                      <Link
                        href={`/${category.slug}/${city.toLowerCase()}`}
                        className="hover:text-primary group flex items-center text-xs text-gray-500 hover:underline"
                      >
                        <ChevronRight
                          size={12}
                          className="-ml-4 opacity-0 transition-all group-hover:opacity-100"
                        />
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {NEPAL_CITIES.slice(0, 48).map(city => (
              <Link
                key={city}
                href={`/${activeCategory.slug}/${city.toLowerCase()}`}
                className="text-[11px] font-medium text-gray-400 hover:text-gray-900"
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
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;
