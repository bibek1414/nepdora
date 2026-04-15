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
    <footer className="pt-6 pb-20">
      <div className="mx-auto max-w-6xl">
        {/* Dense City Grid for SEO */}
        <motion.div
          className=""
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h4 className="mb-6 text-sm font-bold sm:text-xl">
            Explore Website Solutions by Region
          </h4>
          <div className="grid grid-cols-2 gap-x-1 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
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
      </div>
    </footer>
  );
};

export default WebsiteFooter;
