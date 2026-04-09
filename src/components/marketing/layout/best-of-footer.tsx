"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import SocialIcons from "./social-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NEPAL_CITIES } from "@/constants/nepal-cities";

export const BestOfFooter = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "";

  // Extract industry from slug to maintain context
  const isRestaurant = slug.includes("restaurant");
  const isEcommerce = slug.includes("ecommerce");
  const isClothing = slug.includes("clothing");
  const isEducation = slug.includes("educational-consultancy");

  const industryLabel = isRestaurant
    ? "Restaurant"
    : isEcommerce
      ? "E-commerce"
      : isClothing
        ? "Fashion Store"
        : isEducation
          ? "Educational Consultancy"
          : "Website";

  const categoryPrefix = isRestaurant
    ? "website-builders-for-restaurants"
    : isEcommerce
      ? "website-builders-for-ecommerce"
      : isClothing
        ? "website-builders-for-clothing-store"
        : isEducation
          ? "website-builders-for-educational-consultancy"
          : "website-builders-for-restaurants";

  return (
    <div className="border-t border-gray-200 bg-white py-20 text-gray-900">
      <footer className="mx-auto max-w-6xl">
        <div className="">
          {/* Dense City Grid for SEO */}
          <motion.div
            className=""
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-8 text-lg font-bold tracking-tight text-gray-900">
              Find Local Website Solutions by Region
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {NEPAL_CITIES.map(city => (
                <Link
                  key={city}
                  href={`/best/${categoryPrefix}-${city.toLowerCase()}`}
                  className="group flex items-center gap-1.5 text-[11px] font-medium text-gray-500 transition-colors hover:underline"
                >
                  Best {industryLabel} Website Builder in {city}
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
    </div>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link
    href={href}
    className="text-sm font-medium text-gray-500 transition-colors hover:text-black hover:underline"
  >
    {children}
  </Link>
);

export default BestOfFooter;
