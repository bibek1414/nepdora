"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronRight,
  Truck,
  MessageCircle,
  CreditCard,
  Shield,
  Settings,
  TrendingUp,
  Clock,
  Award,
  Filter,
  X,
} from "lucide-react";
import { Integration } from "@/constants/integrations";

interface IntegrationsMarketplaceProps {
  integrations: Integration[];
}

export default function IntegrationsMarketplace({
  integrations,
}: IntegrationsMarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(integrations.map(i => i.category)));
    return ["All", ...cats];
  }, [integrations]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Payment":
        return <CreditCard className="h-3 w-3" />;
      case "Logistics":
        return <Truck className="h-3 w-3" />;
      case "Communication":
        return <MessageCircle className="h-3 w-3" />;
      case "Marketing":
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Settings className="h-3 w-3" />;
    }
  };

  const filteredIntegrations = integrations.filter(i => {
    const matchesCategory =
      activeCategory === "All" || i.category === activeCategory;
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.badge?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    integrations.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [integrations]);

  return (
    <>
      {/* Search and Filter Bar */}
      <section className="sticky top-0 z-20 border-y border-slate-100 bg-white/80 py-4 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}

            {/* Category Pills - Desktop */}
            <div className="hidden flex-wrap items-center gap-2 md:flex">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary -md text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat !== "All" && getCategoryIcon(cat)}
                  {cat}
                  {cat !== "All" && (
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                      {categoryCounts[cat]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="focus:border-primary focus:ring-primary w-full rounded-full border border-slate-200 bg-white py-2.5 pr-4 pl-11 text-sm font-medium outline-none focus:ring-1"
              />
            </div>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 md:hidden"
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeCategory !== "All" && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-2 py-0.5 text-xs">
                  {activeCategory}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Category Filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 md:hidden">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results Count */}
      <section className="pt-6 pb-2">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="text-sm text-slate-500">
            Showing {filteredIntegrations.length} of {integrations.length}{" "}
            integrations
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIntegrations.map(app => (
                <Link
                  key={app.slug}
                  href={`/integrations/${app.slug}`}
                  className="group -sm hover:-md flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1"
                >
                  {/* Logo */}
                  <div className="-sm group-hover:-md mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-white p-3 transition-all">
                    <Image
                      src={app.logo}
                      alt={app.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {getCategoryIcon(app.category)}
                    <span>{app.category}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="group-hover:text-primary mb-1 text-xl font-semibold text-slate-900 transition-colors">
                    {app.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed font-medium text-slate-500">
                    {app.description}
                  </p>

                  {/* Stats Preview */}
                  {app.stats && (
                    <div className="mb-4 flex w-full items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-500">
                          {app.stats[0]?.value} setup
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-500">
                          {app.stats[1]?.value} success
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex w-full items-center justify-between">
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      Learn more
                      <ChevronRight className="text-primary h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    {app.badge && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
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
              <h3 className="text-xl font-semibold text-slate-900">
                No integrations found
              </h3>
              <p className="mt-2 text-slate-500">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="bg-primary/10 text-primary hover:bg-primary/20 mt-4 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900">
              Why connect your tools with{" "}
              <span className="text-primary">Nepdora?</span>
            </h2>
            <p className="mx-auto max-w-2xl text-slate-500">
              Streamline your operations, save time, and grow faster with
              seamless integrations
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Save hours of manual work
              </h3>
              <p className="text-sm text-slate-500">
                Automate order processing, payments, and delivery coordination
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Increase conversions
              </h3>
              <p className="text-sm text-slate-500">
                Offer local payments that customers trust and prefer
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">One-click setup</h3>
              <p className="text-sm text-slate-500">
                No coding required. Just connect and go live in minutes
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-slate-100 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "How do I install an integration?",
                a: "Simply click on any integration card, then click 'Connect' from your dashboard. No coding required.",
              },
              {
                q: "Are there any hidden fees?",
                a: "No. Integration setup is included in your Nepdora plan. Third-party services may have their own fees.",
              },
              {
                q: "Can I use multiple integrations at once?",
                a: "Yes! You can connect as many integrations as your business needs.",
              },
              {
                q: "What if I need help setting up?",
                a: "Our support team is available 24/7 to help you with any integration setup.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Integrations Section */}
      {filteredIntegrations.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Need a custom integration?
                </h3>
                <p className="text-sm text-slate-500">
                  Don't see the tool you need? We're constantly adding new
                  integrations.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
              >
                Request Integration
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
