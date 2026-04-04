import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
import { subscriptionApi } from "@/services/api/subscription";
import Link from "next/link";
import { Check, X, ArrowRight, Wallet, Globe, ShieldCheck, Zap } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "Nepdora vs Shopify Cost Comparison | Save 80% with NPR Pricing",
  description:
    "Detailed comparison of Nepdora vs Shopify for businesses in Nepal. See how much you save with local payments (eSewa/Khalti) and NPR pricing. Stop paying in USD.",
  path: "/pricing/nepdora-vs-shopify-cost-comparison",
  ogTitle: "Nepdora vs Shopify: The Real Cost for Nepali Businesses",
  ogSubtitle: "Save up to 80% annually. Zero transaction fees with local payments.",
});

export default async function ShopifyComparisonPage() {
  const plans = await subscriptionApi.getPlans().catch(() => []);
  const starterPlan = plans.find((p) => p.plan_type === "premium") || plans[0];
  const nepdoraPrice = starterPlan ? parseInt(starterPlan.price) : 500; // Fallback to 500 NPR

  // Comparison Data
  const comparisonData = [
    {
      feature: "Monthly Cost (Base)",
      nepdora: `NPR ${nepdoraPrice}`,
      shopify: "$39 (~NPR 5,200)",
      advantage: "nepdora",
    },
    {
      feature: "Payment Method",
      nepdora: "eSewa, Khalti, ConnectIPS",
      shopify: "International Credit Card Only",
      advantage: "nepdora",
    },
    {
      feature: "Transaction Fees",
      nepdora: "0%",
      shopify: "2% (if not using Shopify Payments)",
      advantage: "nepdora",
    },
    {
      feature: "Currency Risk",
      nepdora: "None (Fixed NPR)",
      shopify: "High (USD Fluctuations)",
      advantage: "nepdora",
    },
    {
      feature: "Local Support",
      nepdora: "Phone, WhatsApp (Nepali)",
      shopify: "Email/Chat Only (English)",
      advantage: "nepdora",
    },
    {
      feature: "Annual Card Limit ($500)",
      nepdora: "Doesn't Apply",
      shopify: "Consumes Your Entire Limit",
      advantage: "nepdora",
    },
  ];

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "breadcrumb": "Home > Pricing > Comparison",
    "mainEntity": {
      "@type": "Table",
      "about": "Cost comparison between Nepdora and Shopify for Nepali market"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <JsonLd id="comparison-schema" data={comparisonSchema} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600 blur-[100px]" />
          <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-teal-600 blur-[100px]" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
            Nepdora vs Shopify
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Why Nepali Businesses are Switching to <span className="text-blue-400">Nepdora</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            Stop paying $500+ annually for global builders. Get a better, localized experience for a fraction of the cost.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">The Real Cost Breakdown</h2>
            <p className="mt-4 text-slate-600">Based on current USD exchange rates and platform requirements.</p>
          </div>

          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="grid grid-cols-3 bg-slate-50 py-6 font-bold text-slate-900">
              <div className="px-6">Feature</div>
              <div className="px-6 text-center text-blue-600">Nepdora</div>
              <div className="px-6 text-center text-slate-500">Shopify</div>
            </div>
            {comparisonData.map((row, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 border-t border-slate-100 py-6 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
              >
                <div className="px-6 font-medium text-slate-700">{row.feature}</div>
                <div className="px-6 text-center font-bold text-slate-900">
                  <div className="flex flex-col items-center gap-1">
                    {row.nepdora}
                    {row.advantage === 'nepdora' && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] uppercase text-green-700">Winner</span>
                    )}
                  </div>
                </div>
                <div className="px-6 text-center text-slate-500">{row.shopify}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Advantages Cards */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">No Credit Card? No Problem.</h3>
              <p className="text-slate-600">
                Shopify requires an international credit card for subscriptions and themes. Nepdora accepts eSewa, Khalti, and local bank transfers.
              </p>
            </div>
            
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-200">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Native Payment Integration</h3>
              <p className="text-slate-600">
                Integrating eSewa or Khalti on Shopify is complex and requires third-party scripts. On Nepdora, it's built-in with one click.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Legal & Compliance</h3>
              <p className="text-slate-600">
                We provide VAT invoices and are a registered Nepalese company, making your business accounting simple and legal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Savings Calculator Placeholder */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Zap className="mx-auto mb-6 h-12 w-12 text-blue-400" />
            <h2 className="mb-8 text-3xl font-bold md:text-5xl">Save Over NPR 50,000 Annually</h2>
            <p className="mb-10 text-xl text-slate-400">
              By switching from Shopify to Nepdora, the average boutique store in Nepal saves enough to cover their hosting and marketing for a full year.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/pricing" 
                className="rounded-full bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700"
              >
                View Nepdora Plans
              </Link>
              <Link 
                href="/contact" 
                className="rounded-full border border-slate-700 bg-slate-800 px-8 py-4 font-bold text-white transition-all hover:bg-slate-700"
              >
                Talk to Migration Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Migration FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Migration FAQ</h2>
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h4 className="mb-2 font-bold text-slate-900">Can I keep my domain?</h4>
              <p className="text-slate-600">Yes, you can easily point your existing .com or .com.np domain to Nepdora servers.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h4 className="mb-2 font-bold text-slate-900">Is migration free?</h4>
              <p className="text-slate-600">We offer free migration support for businesses switching from Shopify or Wix. We'll help move your products and layout.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h4 className="mb-2 font-bold text-slate-900">How long does it take?</h4>
              <p className="text-slate-600">Most stores can be migrated and ready for localized payments in less than 48 hours.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
