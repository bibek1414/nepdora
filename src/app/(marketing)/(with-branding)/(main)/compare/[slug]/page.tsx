import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Zap,
  ShieldCheck,
  Wallet,
  Globe,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Trophy,
  Award,
  CreditCard,
  Percent,
  Calendar,
  Heart,
} from "lucide-react";
import { capitalizeWords } from "@/lib/string-utils";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { buildMarketingMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { ALL_COMPETITORS } from "@/constants/competitors";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitorSlugs = ALL_COMPETITORS.map(c => `${c.slug}-and-nepdora`);
  if (!competitorSlugs.includes(slug)) {
    notFound();
  }
  const platforms = slug.split("-and-");
  const platform1 = capitalizeWords(platforms[0] || "Shopify");
  const platform2 = capitalizeWords(platforms[1] || "Nepdora");

  const title = `${platform1} vs ${platform2} | Which is better for Nepal?`;
  const description = `Compare ${platform1} and ${platform2}. Discover why Nepdora is the best choice for businesses in Nepal with local payments and support.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    keywords: [
      `${platform1} vs ${platform2}`,
      `${platform1} nepal price`,
      `${platform2} vs ${platform1} features`,
    ],
  });
}

export async function generateStaticParams() {
  return ALL_COMPETITORS.map(competitor => ({
    slug: `${competitor.slug}-and-nepdora`,
  }));
}

// Pricing data for different competitors
const getCompetitorPricing = (competitorName: string) => {
  const pricingMap: Record<string, any> = {
    Shopify: {
      freePlan: "3-day trial only",
      starterPrice: "$29 (~Rs 3,800) / month",
      businessPrice: "$79 (~Rs 10,300) / month",
      advancedPrice: "$299 (~Rs 38,900) / month",
      transactionFees: "2% + payment gateway fees",
      setupFee: "None",
      hiddenCosts: "App costs, theme costs",
    },
    Wix: {
      freePlan: "Limited free plan with ads",
      starterPrice: "$17 (~Rs 2,200) / month",
      businessPrice: "$27 (~Rs 3,500) / month",
      advancedPrice: "$59 (~Rs 7,700) / month",
      transactionFees: "1.5% + payment fees",
      setupFee: "None",
      hiddenCosts: "App subscriptions, premium features",
    },
    Webflow: {
      freePlan: "Limited to 2 projects",
      starterPrice: "$14 (~Rs 1,800) / month",
      businessPrice: "$23 (~Rs 3,000) / month",
      advancedPrice: "$39 (~Rs 5,100) / month",
      transactionFees: "2% on e-commerce",
      setupFee: "None",
      hiddenCosts: "Hosting extra, CMS limits",
    },
    WordPress: {
      freePlan: "Software free, hosting paid",
      starterPrice: "$10 (~Rs 1,300) / month for hosting",
      businessPrice: "$25 (~Rs 3,300) / month",
      advancedPrice: "$50 (~Rs 6,500) / month",
      transactionFees: "Plugin dependent",
      setupFee: "Development costs",
      hiddenCosts: "Plugins, themes, security",
    },
    Squarespace: {
      freePlan: "No free plan",
      starterPrice: "$16 (~Rs 2,100) / month",
      businessPrice: "$26 (~Rs 3,400) / month",
      advancedPrice: "$49 (~Rs 6,400) / month",
      transactionFees: "3% on basic plan",
      setupFee: "None",
      hiddenCosts: "Transaction fees, app costs",
    },
    Blanxer: {
      freePlan: "Limited features",
      starterPrice: "Custom pricing",
      businessPrice: "Custom pricing",
      advancedPrice: "Custom pricing",
      transactionFees: "Varies",
      setupFee: "May apply",
      hiddenCosts: "POS hardware, additional users",
    },
    WooCommerce: {
      freePlan: "Plugin free, hosting paid",
      starterPrice: "$10 (~Rs 1,300) / month",
      businessPrice: "$25 (~Rs 3,300) / month",
      advancedPrice: "$50 (~Rs 6,500) / month",
      transactionFees: "Payment gateway fees",
      setupFee: "Development costs",
      hiddenCosts: "Extensions, themes, security",
    },
  };
  return (
    pricingMap[competitorName] || {
      freePlan: "Limited or no free plan",
      starterPrice: "Expensive in USD",
      businessPrice: "Expensive in USD",
      advancedPrice: "Very expensive",
      transactionFees: "Hidden fees apply",
      setupFee: "May apply",
      hiddenCosts: "Many hidden costs",
    }
  );
};

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const competitorSlugs = ALL_COMPETITORS.map(c => `${c.slug}-and-nepdora`);
  if (!competitorSlugs.includes(slug)) {
    notFound();
  }
  const platforms = slug.split("-and-");
  const competitorName = capitalizeWords(platforms[0] || "");
  const competitorPricing = getCompetitorPricing(competitorName);

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${competitorName} vs ${SITE_NAME} Comparison`,
    description: `A detailed comparison between ${competitorName} and ${SITE_NAME} for businesses in Nepal.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  const breadcrumbItems = [
    { label: "Compare", href: "/compare" },
    { label: `${competitorName} vs ${SITE_NAME}`, href: `/compare/${slug}` },
  ];

  // Feature comparison data
  const featureRows = [
    { feature: "Built for Nepal", nepdora: "✅ Yes", competitor: "❌ No" },
    {
      feature: "Local Payments (eSewa/Khalti)",
      nepdora: "✅ Built-in",
      competitor: "❌ Requires plugins",
    },
    { feature: "Pricing in NPR", nepdora: "✅ Yes", competitor: "❌ USD only" },
    { feature: "Transaction Fees", nepdora: "0%", competitor: "1.5% - 2%" },
    {
      feature: "24/7 Nepali Support",
      nepdora: "✅ Yes",
      competitor: "❌ Limited",
    },
    {
      feature: "Local Logistics",
      nepdora: "✅ Built-in",
      competitor: "❌ Not available",
    },
    { feature: "Speed in Nepal", nepdora: "Optimized", competitor: "Slow" },
    { feature: "Mobile Friendly", nepdora: "✅ Yes", competitor: "✅ Yes" },
    { feature: "SEO Tools", nepdora: "Advanced AI", competitor: "Basic" },
    { feature: "Ease of Use", nepdora: "Drag & Drop", competitor: "Complex" },
  ];

  // Pricing comparison rows
  const pricingRows = [
    {
      plan: "Free Plan",
      nepdora: "Rs 0 / month",
      competitor: competitorPricing.freePlan,
      winner: "nepdora",
    },
    {
      plan: "Starter / Basic",
      nepdora: "Rs 833 / month",
      competitor: competitorPricing.starterPrice,
      winner: "nepdora",
    },
    {
      plan: "Business / Pro",
      nepdora: "Rs 1,667 / month",
      competitor: competitorPricing.businessPrice,
      winner: "nepdora",
    },
    {
      plan: "Advanced / Enterprise",
      nepdora: "Custom pricing",
      competitor: competitorPricing.advancedPrice,
      winner: "nepdora",
    },
    {
      plan: "Transaction Fees",
      nepdora: "0%",
      competitor: competitorPricing.transactionFees,
      winner: "nepdora",
    },
    {
      plan: "Setup Cost",
      nepdora: "Rs 0",
      competitor: competitorPricing.setupFee,
      winner: "nepdora",
    },
    {
      plan: "Hidden Costs",
      nepdora: "None",
      competitor: competitorPricing.hiddenCosts,
      winner: "nepdora",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="comparison-schema" data={comparisonSchema} />

      <div className="container mx-auto max-w-6xl px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Platform Comparison
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Nepdora vs {competitorName} -{" "}
              <span className="text-primary">Which is Better for Nepal?</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Compare features, pricing, and performance to choose the right
              website builder for your business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/admin/signup"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
              >
                Start with Nepdora
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

      {/* Introduction Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Choosing the right platform for your business
            </h2>
            <p className="mb-6 text-lg leading-relaxed font-medium text-slate-500">
              Choosing the right website platform can be confusing - especially
              when comparing global tools with platforms built for Nepal.
            </p>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              In this comparison, we break down the key differences between
              Nepdora and {competitorName} to help you make the best decision
              for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                🇳🇵 Built for Nepal
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Nepdora</h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Nepdora is designed specifically for Nepali businesses, offering
                local payment integrations, affordable pricing in NPR, and
                faster performance within Nepal.
              </p>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                🌍 Global Platform
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {competitorName}
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                {competitorName}, on the other hand, is a global platform with
                advanced features but may not be optimized for local needs like
                payments, pricing, or support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Table - NEW SECTION */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <DollarSign className="h-3 w-3" />
              Cost Breakdown
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Pricing Comparison
            </h2>
            <p className="text-lg font-medium text-slate-500">
              See how much you can save by choosing Nepdora over{" "}
              {competitorName}
            </p>
          </div>

          <div className="-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
              <div className="p-4 font-semibold text-slate-900">Plan</div>
              <div className="bg-primary/5 text-primary p-4 text-center font-semibold">
                Nepdora
              </div>
              <div className="p-4 text-center font-semibold text-slate-600">
                {competitorName}
              </div>
            </div>

            {pricingRows.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 border-b border-slate-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <div className="p-4 font-medium text-slate-700">{row.plan}</div>
                <div className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-primary font-bold">
                      {row.nepdora}
                    </span>
                    {row.winner === "nepdora" && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        Winner
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 text-center text-sm text-slate-500">
                  {row.competitor}
                </div>
              </div>
            ))}
          </div>

          {/* Savings Highlight */}
          <div className="bg-primary/5 mt-8 rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
              <Heart className="text-primary h-5 w-5" />
              <p className="text-base font-medium text-slate-700">
                You save up to{" "}
                <span className="text-primary font-bold">
                  Rs 50,000+ yearly
                </span>{" "}
                by choosing Nepdora over {competitorName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <Zap className="h-3 w-3" />
              Feature Breakdown
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Feature Comparison
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Here's a side-by-side comparison of Nepdora and {competitorName}{" "}
              across the features that matter most.
            </p>
          </div>

          <div className="-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
              <div className="p-4 font-semibold text-slate-900">Feature</div>
              <div className="bg-primary/5 text-primary p-4 text-center font-semibold">
                Nepdora
              </div>
              <div className="p-4 text-center font-semibold text-slate-600">
                {competitorName}
              </div>
            </div>

            {featureRows.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 border-b border-slate-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <div className="p-4 font-medium text-slate-700">
                  {row.feature}
                </div>
                <div className="text-primary p-4 text-center font-medium">
                  {row.nepdora}
                </div>
                <div className="p-4 text-center text-slate-500">
                  {row.competitor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Key Differences
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Built for Nepal */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                🇳🇵 Built for Nepal vs Global Platform
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Nepdora is tailored for Nepal, with features like eSewa and
                Khalti integration, local SEO optimization, and pricing in NPR.
              </p>
              <p className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
                {competitorName} is built for a global audience, which may
                require additional setup and third-party tools for Nepali
                businesses.
              </p>
            </div>

            {/* Pricing */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Pricing & Affordability
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Nepdora offers simple and affordable pricing designed for the
                Nepali market, starting at Rs 0.
              </p>
              <p className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
                {competitorName} charges in USD, which can be expensive and
                difficult for local businesses to manage due to exchange rates.
              </p>
            </div>

            {/* Speed */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Speed & Performance
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Nepdora websites are optimized for fast loading speeds in Nepal
                and South Asia with local CDN.
              </p>
              <p className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
                {competitorName} platforms may not always deliver the same
                performance locally due to distant servers.
              </p>
            </div>

            {/* Ease of Use */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Ease of Use
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Nepdora focuses on simplicity - allowing anyone to build a
                website without technical knowledge.
              </p>
              <p className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
                {competitorName} may offer more advanced customization but can
                be harder to use for beginners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Each */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              When to Choose Each
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Choose Nepdora */}
            <div className="border-primary/20 bg-primary/5 -sm rounded-2xl border p-6">
              <div className="bg-primary/20 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-primary mb-4 text-xl font-bold">
                Choose Nepdora if:
              </h3>
              <ul className="space-y-2">
                {[
                  "You are a business in Nepal",
                  "You want local payment integrations",
                  "You prefer simple and fast setup",
                  "You want affordable pricing in NPR",
                  "You don't want technical complexity",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Choose Competitor */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-700">
                Choose {competitorName} if:
              </h3>
              <ul className="space-y-2">
                {[
                  "You need advanced global-level customization",
                  "You are targeting an international audience",
                  "You are comfortable with complex tools",
                  "You don't mind paying in USD",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-500">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nepdora Wins */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why Nepdora Wins for Nepal
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-500">
              For businesses in Nepal, Nepdora provides a more practical and
              efficient solution. It removes unnecessary complexity and focuses
              on what truly matters - helping you launch and grow your business
              online.
            </p>
          </div>
        </div>
      </section>

      <CTASection />

      {/* SEO Closing Paragraph */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-base leading-relaxed font-medium text-slate-500">
            If you are comparing Nepdora vs {competitorName}, the best choice
            depends on your needs. However, for businesses in Nepal, Nepdora
            offers a faster, more affordable, and locally optimized solution
            compared to global platforms.
          </p>
        </div>
      </section>
    </div>
  );
}
