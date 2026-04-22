"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Layout,
  Smartphone,
  Zap,
  Check,
  Search,
  Globe,
  ShoppingCart,
  Utensils,
  Briefcase,
  Stethoscope,
  Store,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetTemplates } from "@/hooks/owner-site/admin/use-template";
import Image from "next/image";
import Link from "next/link";

const mockCategories = [
  { name: "E-commerce", icon: ShoppingCart },
  { name: "Restaurant", icon: Utensils },
  { name: "Portfolio", icon: Briefcase },
  { name: "Agency", icon: Globe },
  { name: "Medical", icon: Stethoscope },
  { name: "Grocery", icon: Store },
  { name: "Education", icon: GraduationCap },
];

function AnimatedTemplateMockup() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: templatesData } = useGetTemplates({
    page: 1,
    page_size: 4,
  });

  const templates = templatesData?.results || [];

  const formatTemplateName = (name: string) => {
    return name
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="relative mx-auto w-full max-w-lg select-none lg:max-w-none">
      {/* Browser card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex shrink-0 gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex w-2/3 max-w-xs items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5">
              <Search className="h-3 w-3 text-slate-400" />
              <div className="mb-2 h-2 w-24 rounded-full text-[10px] text-slate-400">
                nepdora.com/templates
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex h-[420px]">
          {/* Sidebar */}
          <div className="hidden w-1/3 border-r border-slate-100 bg-slate-50/50 p-4 sm:block">
            <div className="mb-6 h-3 w-16 rounded-full bg-slate-200"></div>
            <div className="space-y-4">
              {mockCategories.slice(0, 6).map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -10 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="group flex cursor-pointer items-center gap-2.5"
                >
                  <div className="rounded-md border border-slate-100 bg-white p-1.5 shadow-sm transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50">
                    <cat.icon className="group-hover:text-primary h-3.5 w-3.5 text-slate-500 transition-colors" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 transition-colors group-hover:text-slate-900">
                    {cat.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative flex-1 overflow-hidden bg-slate-50/30 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-5 w-32 rounded-full bg-slate-200"></div>
              <div className="h-7 w-20 rounded-full bg-indigo-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {templates.length > 0
                ? templates.map((tpl, i) => (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: mounted ? 1 : 0,
                        y: mounted ? 0 : 20,
                      }}
                      transition={{
                        delay: i * 0.15 + 0.4,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100">
                        {tpl.template_image ? (
                          <Image
                            unoptimized
                            src={tpl.template_image}
                            alt={tpl.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200">
                            <Layout className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="px-1 pb-1">
                        <p className="mb-0.5 truncate text-xs text-slate-900">
                          {formatTemplateName(tpl.name)}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500/80">
                          {tpl.template_category?.name || "Premium Template"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                : // Fallback skeleton/placeholders if no data
                  [1, 2, 3, 4].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
                    >
                      <div className="mb-3 aspect-4/3 w-full animate-pulse rounded-lg bg-slate-100"></div>
                      <div className="h-2 w-3/4 animate-pulse rounded bg-slate-50"></div>
                    </div>
                  ))}
            </div>

            {/* Gradient fade at bottom */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-white to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Floating pop-ups */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -20 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="absolute top-1/4 -left-6 z-10 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-xl sm:-left-12"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
          <Smartphone className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">100% Responsive</p>
          <p className="text-xs text-slate-500">Mobile-first design</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 20 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="absolute -right-6 bottom-1/4 z-10 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-xl sm:-right-10"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
          <Zap className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Lightning Fast</p>
          <p className="text-xs text-slate-500">Optimized performance</p>
        </div>
      </motion.div>
    </div>
  );
}

export function TemplateHero({ categoryName }: { categoryName: string }) {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden bg-white px-9 py-20 sm:py-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full max-w-7xl -translate-x-1/2">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-indigo-50/60 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/4 rounded-full bg-sky-50/60 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left - text */}
          <div className="max-w-2xl">
            <div className="text-primary mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100/50 bg-indigo-50 px-3 py-1.5 text-sm font-semibold">
              <span>Nepdora Template Library</span>
            </div>

            <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Stunning templates for every need
            </h1>

            <p className="mb-7 text-base leading-relaxed text-slate-500 sm:text-lg">
              Explore our professionally designed {categoryName.toLowerCase()}{" "}
              templates tailored for the Nepali market. Each template is fully
              responsive, customizable, and built for performance with native
              payment integrations.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-slate-600"></p>

            <ul className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Fully responsive & mobile-optimized",
                "SEO ready & built for performance",
                "Native eSewa & Khalti integration",
                "Customizable to fit your brand",
              ].map(feature => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                    <Check className="text-primary h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/free-website-builder">
                <button className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20">
                  Create Free Website
                  <ChevronRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right - interactive animated mockup */}
          <div className="relative lg:pl-6">
            <AnimatedTemplateMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
