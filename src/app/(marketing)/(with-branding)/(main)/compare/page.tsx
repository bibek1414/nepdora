import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Zap,
  ShieldCheck,
  Wallet,
  Globe,
  TrendingUp,
  Layout,
  CreditCard,
  Smartphone,
  Search,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  COMPETITOR_CATEGORIES,
  ALL_COMPETITORS,
} from "@/constants/competitors";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Compare Website Builders - Find the Best Platform for Nepal | Nepdora",
  description:
    "Explore how Nepdora compares with popular website builders like Webflow, Wix, Shopify, and more. Find the perfect platform for your Nepali business.",
  path: "/compare",
  keywords: [
    "compare website builders nepal",
    "nepdora vs wix",
    "nepdora vs shopify",
    "website builder comparison nepal",
    "best website platform nepal",
  ],
});

export default function CompareHubPage() {
  // Get featured comparisons (first 4 from general and e-commerce)
  const featuredCompetitors = [
    { name: "Webflow", slug: "webflow", category: "General Website Builders" },
    { name: "Wix", slug: "wix", category: "General Website Builders" },
    { name: "Shopify", slug: "shopify", category: "E-commerce Builders" },
    { name: "Blanxer", slug: "blanxer", category: "E-commerce Builders" },
    {
      name: "WordPress",
      slug: "wordpress",
      category: "General Website Builders",
    },
    {
      name: "Squarespace",
      slug: "squarespace",
      category: "General Website Builders",
    },
  ];

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Website Builder Comparison Hub",
    description:
      "Compare Nepdora with leading website builders for Nepali businesses.",
    url: absoluteUrl("/compare"),
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
        name: "Compare",
        item: absoluteUrl("/compare"),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="comparison-schema" data={comparisonSchema} />
      <JsonLd id="comparison-breadcrumb" data={breadcrumbSchema} />
      
      <div className="container mx-auto max-w-6xl px-6 pt-4">
        <Breadcrumbs items={[{ label: "Compare", href: "/compare" }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Comparison
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Compare Website Builders -{" "}
              <span className="text-primary">
                Find the Best Platform for Nepal
              </span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Explore how Nepdora compares with popular website builders like
              Webflow, Wix, Shopify, and more.
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
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Why these comparisons matter
          </h2>

          <p className="mb-4 text-lg leading-relaxed text-slate-600">
            Most website builders are designed for global users - not Nepal.
            That means higher costs, payment limitations, and slower performance
            for local businesses.
          </p>

          <p className="mb-4 text-lg leading-relaxed text-slate-600">
            Nepdora is built specifically for the Nepali market, with local
            payments, optimized infrastructure, and pricing in NPR.
          </p>

          <p className="text-lg leading-relaxed text-slate-600">
            These comparisons help you understand exactly what you gain - and
            what you lose - when choosing a platform.
          </p>
        </div>
      </section>

      {/* What You'll Find Here */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What You'll Find Here
            </h2>
            <p className="text-lg font-medium text-slate-500">
              On this page, you can explore side-by-side comparisons between
              Nepdora and other popular platforms.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Layout,
                title: "Features & Capabilities",
                color: "text-blue-500",
              },
              {
                icon: CreditCard,
                title: "Pricing Differences",
                color: "text-emerald-500",
              },
              {
                icon: Smartphone,
                title: "Ease of Use",
                color: "text-purple-500",
              },
              {
                icon: Zap,
                title: "Performance in Nepal",
                color: "text-amber-500",
              },
              {
                icon: Wallet,
                title: "Local Integrations",
                color: "text-primary",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 ${item.color}`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Comparisons Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Popular Comparisons
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Compare Nepdora with leading global and local platforms to
              understand which one works best for your business.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCompetitors.map((competitor, i) => (
              <Link
                key={i}
                href={`/compare/${competitor.slug}-and-nepdora`}
                className="group -sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-gray-500">
                    {competitor.category === "General Website Builders"
                      ? "General"
                      : "E-commerce"}
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mb-1 text-xl font-bold text-slate-900">
                  {competitor.name} vs Nepdora
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Compare features, pricing, and performance to choose the right
                  platform for your business in Nepal.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Comparisons by Category */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              All Comparisons
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Browse through all our detailed comparisons
            </p>
          </div>

          {COMPETITOR_CATEGORIES.map((category, idx) => (
            <div key={idx} className="mb-12 last:mb-0">
              <h3 className="mb-6 text-xl font-bold text-slate-900">
                {category.title}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {category.competitors.map((competitor, i) => (
                  <Link
                    key={i}
                    href={`/compare/${competitor.slug}-and-nepdora`}
                    className="hover:border-primary hover:text-primary flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all"
                  >
                    <span>{competitor.name} vs Nepdora</span>
                    <ChevronRight className="h-3 w-3 opacity-50" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Nepdora for Nepal */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                🇳🇵 Built for Nepal
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Why Nepdora for Nepal
              </h2>
              <p className="mb-6 text-lg leading-relaxed font-medium text-slate-500">
                Most global website builders are not designed for Nepal.
              </p>
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <span className="text-xs">✗</span>
                  </div>
                  <span className="font-medium text-slate-600">
                    Payments in USD
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <span className="text-xs">✗</span>
                  </div>
                  <span className="font-medium text-slate-600">
                    Complex setup
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <span className="text-xs">✗</span>
                  </div>
                  <span className="font-medium text-slate-600">
                    Third-party integrations needed
                  </span>
                </div>
              </div>
              <p className="text-lg leading-relaxed font-medium text-slate-500">
                Nepdora is built specifically for Nepali businesses - making it
                easier, faster, and more affordable to get online.
              </p>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-primary text-2xl font-bold">
                    #1 for Nepal
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Trusted by thousands of Nepali businesses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Choose the Right Platform */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How to Choose the Right Platform
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: DollarSign,
                title: "Your Budget",
                desc: "Consider monthly and yearly costs, transaction fees, and hidden charges.",
              },
              {
                icon: Smartphone,
                title: "Ease of Use",
                desc: "Choose a platform that matches your technical skill level.",
              },
              {
                icon: Wallet,
                title: "Payment Integrations",
                desc: "Ensure local payment methods like eSewa and Khalti are supported.",
              },
              {
                icon: Zap,
                title: "Performance in Nepal",
                desc: "Check loading speeds and reliability on local networks.",
              },
              {
                icon: TrendingUp,
                title: "Long-term Scalability",
                desc: "Pick a platform that can grow with your business.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <item.icon className="h-5 w-5" />
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

          <div className="bg-primary/5 mt-8 rounded-2xl p-6 text-center">
            <p className="text-lg font-medium text-slate-700">
              💡 Nepdora is ideal if you want a simple, powerful solution
              tailored for the local market.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Explore More Comparisons
          </h2>
          <p className="mb-8 text-lg font-medium text-slate-500">
            Not sure where to start? Check out these detailed comparisons:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "webflow",
              "wix",
              "shopify",
              "blanxer",
              "wordpress",
              "squarespace",
            ].map((slug, i) => {
              const name =
                slug === "webflow"
                  ? "Webflow"
                  : slug === "wix"
                    ? "Wix"
                    : slug === "shopify"
                      ? "Shopify"
                      : slug === "blanxer"
                        ? "Blanxer"
                        : slug === "wordpress"
                          ? "WordPress"
                          : "Squarespace";
              return (
                <Link
                  key={i}
                  href={`/compare/${slug}-and-nepdora`}
                  className="hover:border-primary hover:text-primary rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all"
                >
                  {name} vs Nepdora
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Still unsure which platform is right for you?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Start with Nepdora and experience the easiest way to build a
                website in Nepal.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/signup"
                  className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
                >
                  Start My Better Website
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Explore Templates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Closing Paragraph */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-base leading-relaxed font-medium text-slate-500">
            If you are looking to compare website builders in Nepal, Nepdora
            offers a locally optimized solution with better pricing, faster
            performance, and built-in integrations for Nepali businesses.
            Explore our comparison pages to find the best platform for your
            needs.
          </p>
        </div>
      </section>
    </div>
  );
}

// Helper component for DollarSign icon (not in lucide by default)
function DollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
