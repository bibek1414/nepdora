"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  ChevronRight, 
  Zap, 
  Truck, 
  MessageCircle, 
  CreditCard, 
  Shield,
  Sparkles
} from "lucide-react";
import { Integration } from "@/constants/integrations";

interface IntegrationsMarketplaceProps {
  integrations: Integration[];
}

export default function IntegrationsMarketplace({ integrations }: IntegrationsMarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All integrations");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(integrations.map(i => i.category)));
  const allCategories = ["All integrations", ...categories];

  const filteredIntegrations = integrations.filter(i => {
    const matchesCategory =
      activeCategory === "All integrations" || i.category === activeCategory;
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    <>
      {/* Control Bar - Search & Filter */}
      <div className="sticky top-0 z-30 border-y border-slate-100 bg-white/80 py-4 backdrop-blur-xl">
        <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          {/* Categories */}
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto whitespace-nowrap lg:flex-wrap">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {cat === "All integrations" ? null : getIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-11 text-sm font-medium transition-all outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIntegrations.map(app => (
                <Link
                  key={app.slug}
                  href={`/integrations/${app.slug}`}
                  className="group relative flex flex-col items-start rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-100"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md">
                    <Image
                      src={app.logo}
                      alt={app.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="mb-4 flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-colors group-hover:bg-sky-50 group-hover:text-sky-600">
                    {getIcon(app.category)}
                    <span>{app.category}</span>
                  </div>

                  <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                    {app.name}
                  </h3>
                  <p className="mb-10 line-clamp-2 text-sm leading-relaxed font-medium text-slate-500">
                    {app.description}
                  </p>

                  <div className="mt-auto flex w-full items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      Learn more
                      <ChevronRight className="h-4 w-4 text-sky-500 transition-transform group-hover:translate-x-1" />
                    </div>
                    {app.badge && (
                      <span className="text-[10px] font-bold text-emerald-600">
                        {app.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-full bg-slate-100 p-6">
                <Search className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No integrations found
              </h3>
              <p className="mt-2 text-slate-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
