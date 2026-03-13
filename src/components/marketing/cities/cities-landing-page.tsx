"use client";
import React from "react";
import HeroSection from "@/components/marketing/hero-section/hero-section";
import CapabilitiesSection from "@/components/marketing/features/capabilities-section";
import UseCases from "@/components/marketing/use-cases/use-cases";
import CTA from "@/components/marketing/cta-section/cta-section";
import { capitalizeWords } from "@/lib/string-utils";
import { motion } from "framer-motion";

interface SEOLandingPageProps {
  category: string;
  city: string;
}

export const SEOLandingPage: React.FC<SEOLandingPageProps> = ({
  category,
  city,
}) => {
  const cityName = capitalizeWords(city);
  const categoryName = capitalizeWords(category.replace("-", " "));

  return (
    <div className="flex flex-col">
      {/* Custom SEO Hero */}
      <section className="mx-auto max-w-7xl py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl"
          >
            Best {categoryName} in {cityName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl"
          >
            Launch your professional {categoryName.toLowerCase()} in {cityName}{" "}
            with Nepdora. The fastest, AI-powered way to grow your business
            online in Nepal.
          </motion.p>
        </div>
      </section>

      <CapabilitiesSection />

      <UseCases />
      <CTA />
    </div>
  );
};
