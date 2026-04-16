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
  Shirt,
  Dumbbell,
  ShoppingBasket,
} from "lucide-react";

import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Industry Website Solutions in Nepal | Restaurants, Schools & E-commerce | Nepdora",
  description:
    "Explore industry-specific website solutions in Nepal. Build professional websites for restaurants, online stores, schools, and businesses with built-in tools and modern designs.",
  path: "/industries",
  ogLabel: "Nepdora Industry Hub",
});

const getIndustryIcon = (slug: string) => {
  if (slug.includes("restaurant")) return <Utensils className="h-6 w-6" />;
  if (slug.includes("ecommerce") || slug.includes("store"))
    return <ShoppingBag className="h-6 w-6" />;
  if (slug.includes("clothing") || slug.includes("brand"))
    return <Shirt className="h-6 w-6" />;
  if (slug.includes("school") || slug.includes("college"))
    return <GraduationCap className="h-6 w-6" />;
  if (slug.includes("medical") || slug.includes("clinic"))
    return <Stethoscope className="h-6 w-6" />;
  if (slug.includes("travel")) return <Globe className="h-6 w-6" />;
  if (slug.includes("gym") || slug.includes("fitness"))
    return <Dumbbell className="h-6 w-6" />;
  if (slug.includes("real-estate")) return <Home className="h-6 w-6" />;
  if (slug.includes("beauty") || slug.includes("salon"))
    return <Sparkles className="h-6 w-6" />;
  if (slug.includes("grocery")) return <ShoppingBasket className="h-6 w-6" />;
  if (slug.includes("consultancy")) return <Briefcase className="h-6 w-6" />;
  if (slug.includes("agency")) return <Rocket className="h-6 w-6" />;
  return <Building2 className="h-6 w-6" />;
};

const getIndustryColor = (slug: string) => {
  if (slug.includes("restaurant")) return "from-orange-500 to-orange-600";
  if (slug.includes("ecommerce")) return "from-sky-500 to-sky-600";
  if (slug.includes("clothing")) return "from-pink-500 to-pink-600";
  if (slug.includes("school") || slug.includes("college"))
    return "from-blue-500 to-blue-600";
  if (slug.includes("medical") || slug.includes("clinic"))
    return "from-rose-500 to-rose-600";
  if (slug.includes("travel")) return "from-emerald-500 to-emerald-600";
  if (slug.includes("gym") || slug.includes("fitness"))
    return "from-red-500 to-red-600";
  if (slug.includes("real-estate")) return "from-amber-600 to-amber-700";
  if (slug.includes("beauty") || slug.includes("salon"))
    return "from-purple-500 to-purple-600";
  if (slug.includes("grocery")) return "from-green-500 to-green-600";
  if (slug.includes("consultancy")) return "from-indigo-500 to-indigo-600";
  if (slug.includes("agency")) return "from-violet-500 to-violet-600";
  return "from-slate-500 to-slate-600";
};

const getIndustryDescription = (slug: string) => {
  const descriptions: Record<string, string> = {
    "restaurant-website":
      "Digital menus, QR codes, and reservation systems for cafes & restaurants.",
    "ecommerce-store":
      "Scalable online stores with eSewa/Khalti integration and order management.",
    "clothing-brand":
      "High-converting fashion boutiques with size/color variants and lookbooks.",
    "school-college":
      "Institutional websites with admission portals, notices, and event galleries.",
    "medical-clinic":
      "Professional doctor profiles and automated patient appointment scheduling.",
    "travel-agency":
      "Exotic itinerary builders and online booking systems for tours & travel.",
    "gym-fitness":
      "Membership management and class booking systems for fitness centers.",
    "real-estate":
      "Stunning property listings with map integration and lead capture.",
    "beauty-salon":
      "Online booking for salons & spas with stylist portfolios and product sales.",
    "grocery-store":
      "Local delivery management and easy ordering for neighborhood marts.",
    "educational-consultancy":
      "Study abroad portals with course directories and student lead CRM.",
    "digital-agency":
      "Professional portfolios and service showcases with built-in lead generation.",
  };
  return (
    descriptions[slug] ||
    "Professional solutions built specifically for your industry needs in Nepal."
  );
};

export default function IndustriesHubPage() {
  const allIndustries = industries;

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Industries",
        item: absoluteUrl("/industries"),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="industries-schema" data={industriesSchema} />
      <JsonLd id="industries-breadcrumb" data={breadcrumbSchema} />

      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Industries", href: "/industries" }]} />
      </div>
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              Industry Solutions
            </div>
            <h1 className="-tight mb-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
              Built for <span className="text-primary">every industry.</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              From local restaurants in Kathmandu to global e-commerce brands,
              Nepdora provides the specific tools each industry needs to thrive
              online.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/admin/signup"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
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
            {allIndustries.slice(0, 12).map(slug => {
              const label = INDUSTRY_LABELS[slug] || slug;
              const color = getIndustryColor(slug);
              const description = getIndustryDescription(slug);
              return (
                <Link
                  key={slug}
                  href={`/industries/${slug}`}
                  className="group hover:border-primary/20 hover:-xl hover:-primary/5 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1"
                >
                  <div
                    className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${color} -lg -current/10 p-3.5 text-white`}
                  >
                    {getIndustryIcon(slug)}
                  </div>
                  <h3 className="mb-2.5 text-xl font-bold text-slate-900 transition-colors">
                    {label}
                  </h3>
                  <p className="text-[15px] leading-relaxed font-medium text-slate-500">
                    {description}
                  </p>
                  <div className="text-primary mt-5 flex -translate-x-2 items-center gap-1.5 text-sm font-bold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                    Explore Solutions
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="-tight mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
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
                className="-sm rounded-2xl border border-slate-200 bg-white p-5 text-center"
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
            Solutions for Every{" "}
            <span className="text-primary">City in Nepal</span>
          </h2>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Restaurant Example Hub */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <h4 className="-widest mb-6 text-sm font-bold text-slate-400 uppercase">
                Restaurant Solutions by Location
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {MAJOR_CITIES.slice(0, 8).map(city => (
                  <Link
                    key={city}
                    href={`/industries/restaurant-website/${city.toLowerCase()}`}
                    className="text-sm font-medium text-slate-600 transition-colors"
                  >
                    Restaurants in <span className="capitalize">{city}</span>
                  </Link>
                ))}
              </div>
            </div>
            {/* E-commerce Example Hub */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <h4 className="-widest mb-6 text-sm font-bold text-slate-400 uppercase">
                E-commerce Solutions by Location
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {MAJOR_CITIES.slice(0, 8).map(city => (
                  <Link
                    key={city}
                    href={`/industries/grocery-website/${city.toLowerCase()}`}
                    className="text-sm font-medium text-slate-600 transition-colors"
                  >
                    Store Builders in <span className="capitalize">{city}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />

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
