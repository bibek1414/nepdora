import { Metadata } from "next";
import Link from "next/link";
import { industries, INDUSTRY_LABELS, MAJOR_CITIES } from "@/lib/seo-data";
import { buildMarketingMetadata, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import {
  ChevronRight,
  Star,
  BarChart3,
  Rocket,
  Heart,
  Globe,
  ArrowRight,
  Sparkles,
  Utensils,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Building2,
  Home,
  Briefcase,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Industry Solutions | Built for Your Business | Nepdora",
  description:
    "Explore industry-specific website solutions for Restaurants, E-commerce, Schools, and more in Nepal. Professional designs with built-in business tools.",
  path: "/industries",
  ogLabel: "Industry Hub",
});

const getIndustryIcon = (slug: string) => {
  if (slug.includes("restaurant")) return <Utensils className="h-6 w-6" />;
  if (slug.includes("ecommerce") || slug.includes("store"))
    return <ShoppingBag className="h-6 w-6" />;
  if (slug.includes("school") || slug.includes("educational"))
    return <GraduationCap className="h-6 w-6" />;
  if (slug.includes("clinic") || slug.includes("medical"))
    return <Stethoscope className="h-6 w-6" />;
  if (slug.includes("real-estate")) return <Home className="h-6 w-6" />;
  if (slug.includes("agency")) return <Briefcase className="h-6 w-6" />;
  return <Building2 className="h-6 w-6" />;
};

const getIndustryColor = (slug: string) => {
  if (slug.includes("restaurant")) return "from-orange-500 to-orange-600";
  if (slug.includes("ecommerce") || slug.includes("store"))
    return "from-sky-500 to-sky-600";
  if (slug.includes("school") || slug.includes("educational"))
    return "from-blue-500 to-blue-600";
  if (slug.includes("clinic") || slug.includes("medical"))
    return "from-rose-500 to-rose-600";
  if (slug.includes("real-estate")) return "from-emerald-500 to-emerald-600";
  if (slug.includes("agency")) return "from-purple-500 to-purple-600";
  return "from-slate-500 to-slate-600";
};

export default function IndustriesHubPage() {
  // Featured industries for quick access
  const featuredIndustries = industries.slice(0, 6);
  const moreIndustries = industries.slice(6);

  const industriesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Industry Solutions Hub | Nepdora",
    description:
      "Professional website solutions for Restaurants, E-commerce, Schools, and more in Nepal.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="industries-schema" data={industriesSchema} />
      
      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Industries", href: "/industries" }]} />
      </div>
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Industry Solutions
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Built for <span className="text-primary">every industry.</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              From local restaurants in Kathmandu to global e-commerce brands,
              Nepdora provides the specific tools each industry needs to thrive
              online.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/create-website"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Start Building
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Industry Matters */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
              Websites that work for your business
            </h2>
            <p className="text-lg text-slate-500">
              Every industry has unique needs. Nepdora provides tailored
              solutions with built-in features for your specific business type.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Industries Grid */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredIndustries.map(slug => {
              const label = INDUSTRY_LABELS[slug] || slug;
              const color = getIndustryColor(slug);
              return (
                <Link
                  key={slug}
                  href={`/templates/${slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow-md`}
                  >
                    {getIndustryIcon(slug)}
                  </div>
                  <h3 className="group-hover:text-primary mb-2 text-xl font-bold text-slate-900 transition-colors">
                    {label}
                  </h3>
                  <p className="text-sm leading-relaxed font-medium text-slate-500">
                    Professional templates and tools designed specifically for{" "}
                    {label.toLowerCase()} businesses in Nepal.
                  </p>
                  <div className="text-primary mt-4 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                    Explore Solutions
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* More Industries */}
      {moreIndustries.length > 0 && (
        <section className="border-y border-slate-100 bg-slate-50 py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              More Industries We Serve
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {moreIndustries.map(slug => (
                <Link
                  key={slug}
                  href={`/templates/${slug}`}
                  className="hover:border-primary hover:text-primary rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all"
                >
                  {INDUSTRY_LABELS[slug] || slug}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Every industry solution comes with these powerful features
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "Fast Loading",
                desc: "Optimized for Nepal's networks",
              },
              {
                icon: CheckCircle2,
                title: "Mobile Ready",
                desc: "Looks great on all devices",
              },
              { icon: Globe, title: "Local SEO", desc: "Rank higher in Nepal" },
              {
                icon: Heart,
                title: "Local Payments",
                desc: "eSewa & Khalti built-in",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-primary text-2xl font-bold">2,000+</div>
              <div className="text-xs text-slate-500">Businesses Powered</div>
            </div>
            <div>
              <div className="text-primary text-2xl font-bold">50+</div>
              <div className="text-xs text-slate-500">Industries Served</div>
            </div>
            <div>
              <div className="text-primary text-2xl font-bold">24/7</div>
              <div className="text-xs text-slate-500">Nepali Support</div>
            </div>
            <div>
              <div className="text-primary text-2xl font-bold">99.9%</div>
              <div className="text-xs text-slate-500">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry by City Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
            Solutions for Every <span className="text-primary">City in Nepal</span>
          </h2>
          <div className="grid gap-12 lg:grid-cols-2">
             {/* Restaurant Example Hub */}
             <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                  Restaurant Solutions by Location
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   {MAJOR_CITIES.slice(0, 8).map(city => (
                     <Link 
                       key={city} 
                       href={`/restaurant-website/${city.toLowerCase()}`}
                       className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                     >
                        Restaurants in <span className="capitalize">{city}</span>
                     </Link>
                   ))}
                </div>
             </div>
             {/* E-commerce Example Hub */}
             <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                  E-commerce Solutions by Location
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   {MAJOR_CITIES.slice(0, 8).map(city => (
                     <Link 
                       key={city} 
                       href={`/grocery-website/${city.toLowerCase()}`}
                       className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                     >
                        Store Builders in <span className="capitalize">{city}</span>
                     </Link>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Sparkles className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Don't see your industry?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Our flexible builder can handle any business model. Talk to our
                experts about creating a custom digital presence for your unique
                niche.
              </p>
              <Link
                href="/contact"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Get a Custom Consultation
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Closing */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm leading-relaxed font-medium text-slate-500">
            Looking for an industry-specific website solution in Nepal? Nepdora
            offers tailored website builders for restaurants, e-commerce stores,
            schools, clinics, and more. Get started today with a free plan.
          </p>
        </div>
      </section>
    </div>
  );
}
