import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMarketingMetadata } from "@/lib/seo";
import { subscriptionApi } from "@/services/api/subscription";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Wallet,
  Globe,
  ShieldCheck,
  Zap,
  CreditCard,
  TrendingDown,
  Headphones,
  Award,
  Clock,
} from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { PRICING_COMPARISON_DATA } from "@/constants/pricing-comparison";
import Comparison from "@/components/marketing/comparison/comparison";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = PRICING_COMPARISON_DATA[slug];

  if (!data) {
    return buildMarketingMetadata({
      title: "Pricing Comparison",
      description: "Compare Nepdora pricing with other global platforms.",
      path: "/pricing",
    });
  }

  return buildMarketingMetadata({
    title: `Nepdora vs ${data.platformName} Cost Comparison | Save 80%`,
    description: `Detailed comparison of Nepdora vs ${data.platformName} for businesses in Nepal. See how much you save with local payments (eSewa/Khalti) and NPR pricing.`,
    path: `/pricing/comparison/${slug}`,
    ogTitle: `Nepdora vs ${data.platformName}: The Real Cost for Nepali Businesses`,
    ogSubtitle:
      "Save up to 80% annually. Zero transaction fees with local payments.",
  });
}

export async function generateStaticParams() {
  return Object.keys(PRICING_COMPARISON_DATA).map(slug => ({
    slug,
  }));
}

export default async function CostComparisonPage({ params }: Props) {
  const { slug } = await params;
  const data = PRICING_COMPARISON_DATA[slug];

  if (!data) {
    notFound();
  }

  const plans = await subscriptionApi.getPlans().catch(() => []);
  const starterPlan = plans.find(p => p.plan_type === "premium") || plans[0];
  const nepdoraPrice = starterPlan ? parseInt(starterPlan.price) : 10000; // Rs 10,000/year
  const nepdoraMonthly = Math.round(nepdoraPrice / 12);

  const comparisonData = [
    {
      feature: "Yearly Cost",
      nepdora: `Rs ${nepdoraPrice.toLocaleString()}`,
      competitor: data.monthlyCostNPR,
      advantage: "nepdora",
    },
    {
      feature: "Monthly Cost",
      nepdora: `Rs ${nepdoraMonthly.toLocaleString()}`,
      competitor: data.monthlyCostNPR,
      advantage: "nepdora",
    },
    {
      feature: "Transaction Fees",
      nepdora: "0%",
      competitor: data.transactionFees,
      advantage: "nepdora",
    },
    {
      feature: "Local Payments",
      nepdora: "eSewa, Khalti, Fonepay",
      competitor: data.paymentMethod,
      advantage: "nepdora",
    },
    {
      feature: "Nepali Support",
      nepdora: "24/7 Phone, WhatsApp",
      competitor: data.localSupport,
      advantage: "nepdora",
    },
    {
      feature: "Currency",
      nepdora: "NPR (No exchange risk)",
      competitor: data.currencyRisk,
      advantage: "nepdora",
    },
    {
      feature: "Local Logistics",
      nepdora: "Pathao, Dash built-in",
      competitor: "Not available",
      advantage: "nepdora",
    },
    {
      feature: "Speed in Nepal",
      nepdora: "Optimized",
      competitor: "Slow",
      advantage: "nepdora",
    },
  ];

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    breadcrumb: `Home > Pricing > Comparison > ${data.platformName}`,
    mainEntity: {
      "@type": "Table",
      about: `Cost comparison between Nepdora and ${data.platformName} for Nepali market`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="comparison-schema" data={comparisonSchema} />

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Nepdora vs {data.platformName}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Why Nepali Businesses are Switching from{" "}
              <span className="text-primary">{data.platformName}</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Stop paying high USD subscriptions for global platforms. Get a
              better, localized experience for a fraction of the cost.
            </p>
          </div>
        </div>
      </section>

      {/* Savings Highlight */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <div className="text-primary mb-2 text-4xl font-bold">
                Save Over Rs 50,000
              </div>
              <p className="text-slate-600">
                Annually compared to {data.platformName}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/pricing"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                View Nepdora Plans
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Talk to Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {data.platformName} vs Nepdora: Cost Breakdown
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Based on current USD exchange rates and platform requirements for
              Nepal
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
              <div className="p-4 font-semibold text-slate-900">Feature</div>
              <div className="bg-primary/5 text-primary p-4 text-center font-semibold">
                Nepdora
              </div>
              <div className="p-4 text-center font-semibold text-slate-600">
                {data.platformName}
              </div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 border-b border-slate-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <div className="p-4 font-medium text-slate-700">
                  {row.feature}
                </div>
                <div className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-primary font-bold">
                      {row.nepdora}
                    </span>
                    {row.advantage === "nepdora" && (
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
        </div>
      </section>

      {/* General Feature Comparison */}
      <Comparison platformName={data.platformName} />

      {/* Key Advantages Cards */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why Nepdora is the{" "}
              <span className="text-primary">Smart Choice</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Built specifically for Nepali businesses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                No Credit Card? No Problem.
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                {data.platformName} requires an international credit card.
                Nepdora accepts eSewa, Khalti, and local bank transfers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Native Payment Integration
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Integrating local payments on {data.platformName} is complex. On
                Nepdora, it's built-in with one click.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Legal & Compliance
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                We provide local VAT invoices, making your business accounting
                simple and legal in Nepal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Save Over{" "}
                <span className="text-primary">Rs 50,000 Annually</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed font-medium text-slate-500">
                By switching from {data.platformName} to Nepdora, the average
                business in Nepal saves enough to cover their hosting and
                marketing for a full year.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    No hidden transaction fees
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    No currency exchange losses
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    No international credit card needed
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <TrendingDown className="h-8 w-8" />
              </div>
              <div className="text-primary mb-2 text-4xl font-bold">80%</div>
              <p className="text-sm font-medium text-slate-500">
                Average savings compared to {data.platformName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration FAQ */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {data.platformName} to{" "}
              <span className="text-primary">Nepdora FAQ</span>
            </h2>
          </div>

          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="mb-2 font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {faq.answer}
                </p>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 font-semibold text-slate-900">
                How long does migration take?
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Most stores can be migrated and ready for localized payments in
                less than 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Zap className="text-primary h-8 w-8" />
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
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="border-t border-slate-100 bg-white py-6">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            *Comparison based on standard {data.platformName} plans as of 2026.
            Exchange rate used: 1 USD = 130 NPR.
          </p>
        </div>
      </section>
    </div>
  );
}
