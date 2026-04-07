"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { INTEGRATIONS } from "@/constants/integrations";
import {
  Zap,
  Shield,
  CreditCard,
  Truck,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] =
    useState<string>("All integrations");
  const categories = Array.from(new Set(INTEGRATIONS.map(i => i.category)));
  const allCategories = ["All integrations", ...categories];

  const filteredIntegrations =
    activeCategory === "All integrations"
      ? INTEGRATIONS
      : INTEGRATIONS.filter(i => i.category === activeCategory);

  const getIcon = (category: string) => {
    switch (category) {
      case "Payment":
        return <CreditCard className="h-4 w-4" />;
      case "Logistics":
        return <Truck className="h-4 w-4" />;
      case "Communication":
        return <MessageCircle className="h-4 w-4" />;
      case "Marketing":
        return <Zap className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
              <Zap className="h-4 w-4 text-sky-500" />
              <span>Integration marketplace</span>
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
              Connect the tools you{" "}
              <span className="text-sky-600">already love.</span>
            </h1>
            <p className="text-xl leading-relaxed font-medium text-slate-500">
              Supercharge your website with native integrations for Nepal's
              leading platforms. No coding, no complex setups—just seamless
              connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="scrollbar-hide container mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-4 whitespace-nowrap">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {cat}
              <ChevronRight
                size={14}
                className={
                  activeCategory === cat ? "text-sky-400" : "text-slate-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <section className="min-h-[400px] py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map(app => (
              <Link
                key={app.slug}
                href={`/integrations/${app.slug}`}
                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-10 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                    <Image
                      src={app.logo}
                      alt={app.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="group-hover:text-primary flex items-center gap-1.5 text-xs font-medium tracking-tight text-slate-400 transition-colors">
                    {getIcon(app.category)}
                    <span>{app.category}</span>
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                  {app.name}
                </h3>
                <p className="mb-10 line-clamp-2 text-sm leading-relaxed font-medium text-slate-500">
                  {app.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-900 transition-all group-hover:gap-3">
                  View integration
                  <ChevronRight className="h-4 w-4 text-sky-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest Tool / CTA Section */}
      <section className="border-t border-slate-100 bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 px-8 py-16 text-center md:px-16 md:py-24">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-100/50 blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-50/30 blur-[100px]" />

            <h2 className="relative z-10 mb-6 text-3xl font-extrabold text-slate-900 md:text-5xl">
              Missing a tool?
            </h2>
            <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg leading-relaxed font-medium text-slate-500">
              We're constantly adding new integrations. If you need a specific
              tool connected to your Nepdora site, reach out to our team.
            </p>
            <Link
              href="/contact"
              className="relative z-10 inline-flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
            >
              Request an integration
              <ChevronRight className="h-5 w-5 text-sky-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
