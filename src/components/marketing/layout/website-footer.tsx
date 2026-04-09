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
import { usePathname } from "next/navigation";

import Link from "next/link";
import { NEPAL_CITIES, SERVICE_CATEGORIES } from "@/constants/nepal-cities";
import Image from "next/image";

export const WebsiteFooter = () => {
  const pathname = usePathname();
  // Find which category we are currently in

  const activeCategory =
    SERVICE_CATEGORIES.find(cat => pathname.includes(cat.slug)) ||
    SERVICE_CATEGORIES[0];

  // Take first 12 cities for more density, or all
  const displayedCities = NEPAL_CITIES.slice(0, 18);

  return (
    <footer className="border-t pt-6 pb-20">
      <div className="mx-auto max-w-6xl">
        {/* Dense City Grid for SEO */}
        <motion.div
          className=""
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
                className="text-[11px] font-medium text-gray-600 hover:underline"
              >
                {activeCategory.name} in {city}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-6 text-xs text-gray-600 md:flex-row">
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
