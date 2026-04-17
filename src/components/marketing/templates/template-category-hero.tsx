"use client";

import React from "react";
import {
  ChevronRight,
  Check,
  Zap,
  Smartphone,
  Layout,
  Sparkles,
  CreditCard,
  Globe,
  Search,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface TemplateCategoryHeroProps {
  categoryName: string;
  categoryDescription?: string;
  categoryBadge?: string;
  templateCount?: number;
  features?: string[];
}

export function TemplateCategoryHero({
  categoryName,
  categoryDescription,
  categoryBadge,
  templateCount = 24,
  features = [
    "Fully responsive & mobile-optimized",
    "SEO ready & built for performance",
    "Native eSewa & Khalti integration",
    "Customizable to fit your brand",
    "Lightning fast loading speed",
    "Local support & guidance",
  ],
}: TemplateCategoryHeroProps) {
  // Get category-specific stats
  const getCategoryStats = () => {
    const stats: Record<string, { templates: number; businesses: string }> = {
      restaurant: { templates: 18, businesses: "500+ restaurants" },
      ecommerce: { templates: 24, businesses: "1,000+ online stores" },
      portfolio: { templates: 15, businesses: "300+ creatives" },
      agency: { templates: 12, businesses: "200+ agencies" },
      medical: { templates: 10, businesses: "150+ clinics" },
      grocery: { templates: 8, businesses: "100+ stores" },
      education: { templates: 14, businesses: "250+ institutions" },
    };
    const key = categoryName.toLowerCase();
    return (
      stats[key] || {
        templates: templateCount,
        businesses: "Growing businesses",
      }
    );
  };

  const stats = getCategoryStats();
  const displayName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-16 lg:pt-28 lg:pb-20">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[20%] h-[300px] w-[600px] rounded-full bg-slate-50/50 opacity-60 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}

              {/* Title */}
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {displayName} Templates
                <span className="text-primary"> For Nepal</span>
              </h1>

              {/* Description */}
              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                {categoryDescription ||
                  `Launch your professional ${displayName.toLowerCase()} website with our ready-to-use templates. Built specifically for the Nepali market with local payment integrations and mobile-first design.`}
              </p>

              {/* Stats */}
              <div className="mb-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Layout className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {stats.templates}+
                    </div>
                    <div className="text-xs text-slate-500">
                      Templates available
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {stats.businesses}
                    </div>
                    <div className="text-xs text-slate-500">Trust Nepal's</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/admin/signup" className="group">
                  <button className="bg-primary -md hover:-lg inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105">
                    Start Building
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/templates" className="group">
                  <button className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
                    Browse all templates
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-full">
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="-xl overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="mx-auto flex flex-1 justify-center">
                    <div className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5">
                      <Globe className="h-3 w-3 text-slate-400" />
                      <div className="mb-2 h-2 rounded-full text-[10px] text-slate-400">
                        nepdora.com/templates/{displayName.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-5">
                  {/* Hero Preview */}
                  <div className="from-primary/5 mb-5 rounded-xl bg-gradient-to-br to-transparent p-4">
                    <div className="bg-primary/20 mb-2 h-3 w-20 rounded-full" />
                    <div className="mb-1 h-6 w-40 rounded-full bg-slate-800" />
                    <div className="h-4 w-32 rounded-full bg-slate-300" />
                  </div>

                  {/* Feature Cards Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="-sm rounded-xl border border-slate-100 bg-white p-3"
                      >
                        <div className="bg-primary/10 mb-2 h-8 w-8 rounded-lg" />
                        <div className="mb-1 h-2 w-full rounded-full bg-slate-200" />
                        <div className="h-2 w-2/3 rounded-full bg-slate-100" />
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA Preview */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex gap-2">
                      <div className="bg-primary/20 h-8 w-8 rounded-full" />
                      <div>
                        <div className="h-2 w-20 rounded-full bg-slate-700" />
                        <div className="mt-1 h-1.5 w-12 rounded-full bg-slate-300" />
                      </div>
                    </div>
                    <div className="bg-primary/10 h-6 w-16 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="-lg absolute -top-4 -right-4 z-10 flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 sm:top-0 sm:-right-6"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="pr-2">
                  <p className="text-xs font-semibold text-slate-900">
                    100% responsive
                  </p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="-lg absolute -bottom-4 -left-4 z-10 flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 sm:-bottom-2 sm:-left-6"
              >
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="pr-2">
                  <p className="text-xs font-semibold text-slate-900">
                    Fast loading
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
