import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

export const dynamic = "force-dynamic";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Receipt,
  Zap,
  ShieldCheck,
  CreditCard,
  Clock,
  DollarSign,
  Globe,
  Smartphone,
  Headphones,
  Rocket,
  TrendingDown,
  Award,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COMPETITORS.map(c => ({
    slug: `from-${c.slug}-to-nepdora`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitorSlug = slug.replace("from-", "").replace("-to-nepdora", "");
  const competitor = ALL_COMPETITORS.find(c => c.slug === competitorSlug);

  if (!competitor) return notFound();

  return buildMarketingMetadata({
    title: `Switch from ${competitor.name} to Nepdora | Better for Nepal`,
    description: `Compare ${competitor.name} vs Nepdora. Save on fees, enjoy local payments, and get 24/7 Nepali support. Migration guide included.`,
    path: `/switch/${slug}`,
    ogLabel: "Competitor Comparison",
  });
}

export default async function SwitchComparisonPage({ params }: Props) {
  const { slug } = await params;
  const competitorSlug = slug.replace("from-", "").replace("-to-nepdora", "");
  const competitor = ALL_COMPETITORS.find(c => c.slug === competitorSlug);

  if (!competitor) return notFound();

  // Comprehensive comparison data for all competitors
  const comparisonData: Record<string, any> = {
    shopify: {
      monthlyCost: "$29 - $299 (~Rs 3,800 - Rs 39,000)",
      yearlyCost: "$348 - $3,588 (~Rs 45,000 - Rs 470,000)",
      transactionFees: "2% + payment fees",
      payments: "International gateways only",
      support: "Email/Chat (English only)",
      speed: "Global servers, slow in Nepal",
      localFeatures: "None",
      easeOfUse: "Medium",
      design: "Good templates",
      seo: "Basic tools",
    },
    wix: {
      monthlyCost: "$17 - $59 (~Rs 2,200 - Rs 7,700)",
      yearlyCost: "$204 - $708 (~Rs 26,500 - Rs 92,000)",
      transactionFees: "1.5% + payment fees",
      payments: "Complex Nepal integration",
      support: "Knowledge base / Tickets",
      speed: "Average globally",
      localFeatures: "Very limited",
      easeOfUse: "Easy",
      design: "Good templates",
      seo: "Basic tools",
    },
    wordpress: {
      monthlyCost: "$10 - $50 hosting (~Rs 1,300 - Rs 6,500)",
      yearlyCost: "$120 - $600 (~Rs 15,600 - Rs 78,000)",
      transactionFees: "Payment plugin fees",
      payments: "Requires plugins & coding",
      support: "Community forums",
      speed: "Slow without optimization",
      localFeatures: "Plugin dependent",
      easeOfUse: "Complex",
      design: "Theme dependent",
      seo: "Plugin dependent",
    },
    squarespace: {
      monthlyCost: "$16 - $49 (~Rs 2,100 - Rs 6,400)",
      yearlyCost: "$192 - $588 (~Rs 25,000 - Rs 76,500)",
      transactionFees: "3% on basic plan",
      payments: "Stripe only (no Nepal)",
      support: "Email/Chat",
      speed: "Good globally",
      localFeatures: "None",
      easeOfUse: "Easy",
      design: "Beautiful templates",
      seo: "Good tools",
    },
    blanxer: {
      monthlyCost: "Custom pricing",
      yearlyCost: "Custom pricing",
      transactionFees: "Varies",
      payments: "Limited integration",
      support: "Email support",
      speed: "Average",
      localFeatures: "POS focused",
      easeOfUse: "Medium",
      design: "Basic templates",
      seo: "Limited",
    },
    woocommerce: {
      monthlyCost: "$10 - $50 hosting (~Rs 1,300 - Rs 6,500)",
      yearlyCost: "$120 - $600 (~Rs 15,600 - Rs 78,000)",
      transactionFees: "Payment gateway fees",
      payments: "Plugin dependent",
      support: "Community forums",
      speed: "Needs optimization",
      localFeatures: "Plugin dependent",
      easeOfUse: "Complex",
      design: "Theme dependent",
      seo: "Plugin dependent",
    },
    webflow: {
      monthlyCost: "$14 - $39 (~Rs 1,800 - Rs 5,100)",
      yearlyCost: "$168 - $468 (~Rs 21,800 - Rs 60,800)",
      transactionFees: "None",
      payments: "Stripe only",
      support: "Email support",
      speed: "Excellent",
      localFeatures: "None",
      easeOfUse: "Steep learning curve",
      design: "Excellent",
      seo: "Good tools",
    },
    bigcommerce: {
      monthlyCost: "$29 - $299 (~Rs 3,800 - Rs 39,000)",
      yearlyCost: "$348 - $3,588 (~Rs 45,000 - Rs 470,000)",
      transactionFees: "None on higher plans",
      payments: "International only",
      support: "24/7 support",
      speed: "Good",
      localFeatures: "None",
      easeOfUse: "Medium",
      design: "Good templates",
      seo: "Advanced tools",
    },
  };

  const comp = comparisonData[competitorSlug] || {
    monthlyCost: "Varies (High for Nepal)",
    yearlyCost: "Expensive",
    transactionFees: "Hidden fees",
    payments: "Unreliable in Nepal",
    support: "No local support",
    speed: "Average",
    localFeatures: "None",
    easeOfUse: "Varies",
    design: "Varies",
    seo: "Limited",
  };

  // Nepdora features (same for all comparisons)
  const nepdoraFeatures = {
    monthlyCost: "Rs 0 - Rs 1,667",
    yearlyCost: "Rs 0 - Rs 20,000",
    transactionFees: "0%",
    payments: "eSewa, Khalti, Fonepay",
    support: "24/7 Nepali Support",
    speed: "Optimized for Nepal",
    localFeatures: "Full Nepal support",
    easeOfUse: "Drag & Drop",
    design: "Modern templates",
    seo: "Advanced AI tools",
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        id="switch-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: `Switch from ${competitor.name} to Nepdora`,
          description: `Comprehensive comparison and migration guide from ${competitor.name} to Nepdora for Nepali businesses.`,
          url: absoluteUrl(`/switch/${slug}`),
          author: { "@type": "Organization", name: "Nepdora" },
        }}
      />
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <Link
            href="/switch"
            className="hover:text-primary mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Migration Center
          </Link>

          <div className="flex flex-col items-center justify-center gap-8 text-center md:flex-row md:gap-16">
            <div className="flex-1">
              <div className="inline-block rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                Migrate from
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-400 md:text-4xl">
                {competitor.name}
              </h2>
            </div>
            <div className="flex-none">
              <div className="bg-primary/10 rounded-full p-4">
                <ChevronRight className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1 text-sm font-medium">
                Switch to
              </div>
              <h2 className="text-primary mt-4 text-3xl font-bold md:text-4xl">
                Nepdora
              </h2>
            </div>
          </div>

          <h1 className="mt-12 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            The better choice for <span className="text-primary">Nepal.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-medium text-slate-500">
            Save money, get local payments, and receive support in your language
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-8">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
              <div className="p-4 text-left font-semibold text-slate-900">
                Feature
              </div>
              <div className="p-4 text-left font-semibold text-slate-600">
                {competitor.name}
              </div>
              <div className="bg-primary/5 text-primary p-4 text-left font-semibold">
                Nepdora
              </div>
            </div>

            {/* Table Rows */}
            {[
              {
                label: "Monthly Cost",
                comp: comp.monthlyCost,
                nepdora: nepdoraFeatures.monthlyCost,
                icon: DollarSign,
              },
              {
                label: "Yearly Cost",
                comp: comp.yearlyCost,
                nepdora: nepdoraFeatures.yearlyCost,
                icon: Receipt,
              },
              {
                label: "Transaction Fees",
                comp: comp.transactionFees,
                nepdora: nepdoraFeatures.transactionFees,
                icon: CreditCard,
              },
              {
                label: "Local Payments",
                comp: comp.payments,
                nepdora: nepdoraFeatures.payments,
                icon: CreditCard,
              },
              {
                label: "Nepali Support",
                comp: comp.support,
                nepdora: nepdoraFeatures.support,
                icon: Headphones,
              },
              {
                label: "Speed in Nepal",
                comp: comp.speed,
                nepdora: nepdoraFeatures.speed,
                icon: Zap,
              },
              {
                label: "Local Features",
                comp: comp.localFeatures,
                nepdora: nepdoraFeatures.localFeatures,
                icon: Globe,
              },
              {
                label: "Ease of Use",
                comp: comp.easeOfUse,
                nepdora: nepdoraFeatures.easeOfUse,
                icon: Smartphone,
              },
              {
                label: "Design Quality",
                comp: comp.design,
                nepdora: nepdoraFeatures.design,
                icon: Award,
              },
              {
                label: "SEO Tools",
                comp: comp.seo,
                nepdora: nepdoraFeatures.seo,
                icon: TrendingDown,
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 border-b border-slate-100 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2 p-4">
                  <row.icon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {row.label}
                  </span>
                </div>
                <div className="p-4 text-sm text-slate-500">{row.comp}</div>
                <div className="bg-primary/5 text-primary p-4 text-sm font-medium">
                  {row.nepdora}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differences Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Key differences at a glance
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Up to 80% Savings
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Stop paying expensive international fees. Nepdora is priced for
                Nepal.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Local Payments
              </h3>
              <p className="text-sm font-medium text-slate-500">
                eSewa, Khalti, and Fonepay built-in. No complex setup required.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                24/7 Nepali Support
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Get help in your language, when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How much could you save?
            </h2>
            <p className="mb-8 text-lg font-medium text-slate-500">
              Calculate your potential savings by switching to Nepdora
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="font-medium text-slate-700">
                  Current platform cost
                </span>
                <span className="font-bold text-slate-900">
                  {comp.yearlyCost}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="font-medium text-slate-700">Nepdora cost</span>
                <span className="text-primary font-bold">
                  Rs 0 - Rs 20,000/year
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-semibold text-slate-900">
                  Estimated yearly savings
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  Rs 40,000 - Rs 450,000+
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Why switch from{" "}
                <span className="text-primary">{competitor.name}</span>
              </h2>
              <div className="mb-6 space-y-3">
                <p className="text-lg leading-relaxed font-medium text-slate-500">
                  {competitor.name} wasn't built for Nepal. Here's why thousands
                  of businesses are making the switch:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span>Save up to 80% on website costs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span>Accept eSewa and Khalti payments instantly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span>Get support in Nepali, 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span>Faster loading speeds on Nepali networks</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Rocket className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Migration Made Easy
                </h3>
              </div>
              <p className="mb-4 text-sm font-medium text-slate-500">
                Our team can help you migrate all your products, customers, and
                content from {competitor.name} to Nepdora with zero downtime.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>Free migration assessment</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>Preserve your SEO rankings</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>Done in under 48 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ShieldCheck className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to make the switch?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Join thousands of Nepali businesses that have already switched
                to Nepdora.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
                >
                  Start Free Trial
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Talk to Migration Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
