import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
import Link from "next/link";
import { Check, Shield, Zap, CreditCard, ChevronRight, X } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "Complete Guide to Payment Gateways in Nepal | eSewa, Khalti, ConnectIPS",
  description:
    "Learn how to accept online payments in Nepal. A comprehensive guide to eSewa, Khalti, and IME Pay integration for your website with Nepdora.",
  path: "/payment-gateways-nepal",
  ogTitle: "Accepting Online Payments in Nepal: The Ultimate Guide",
  ogSubtitle: "Everything you need to know about eSewa, Khalti and local bank integration.",
});

export default function PaymentGatewaysPage() {
  const gateways = [
    {
      name: "eSewa",
      description: "Nepal's first and largest digital wallet. Essential for any online business.",
      features: ["Highest User Base", "Secure SDK", "Instant Settlement"],
      color: "bg-green-600",
    },
    {
      name: "Khalti",
      description: "Modern, developer-friendly payment gateway with excellent UI/UX.",
      features: ["Quick Integration", "Multiple Payment Methods", "Great Reporting"],
      color: "bg-purple-600",
    },
    {
      name: "ConnectIPS",
      description: "Direct bank-to-bank transfers for high-value transactions.",
      features: ["Low Fees", "Direct Bank Account Search", "Reliable Infrastructure"],
      color: "bg-blue-800",
    },
  ];

  const gatewaySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete Guide to Payment Gateways in Nepal",
    "description": "Learn about integration of eSewa, Khalti and more in Nepal.",
    "author": { "@type": "Organization", "name": "Nepdora" }
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="gateway-schema" data={gatewaySchema} />
      
      {/* Hero */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl text-slate-900">
              Start Accepting <span className="text-blue-600">Online Payments</span> in Nepal
            </h1>
            <p className="text-xl text-slate-600">
              Stop losing sales because you don't have an international credit card. Accept local payments from 20M+ Nepalese users.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Guide Text */}
            <div className="lg:col-span-8">
              <h2 className="mb-8 text-3xl font-bold">The State of Online Payments in Nepal (2024)</h2>
              <div className="prose prose-blue max-w-none text-slate-600">
                <p className="mb-6">
                  For years, starting an e-commerce business in Nepal was difficult due to the lack of seamless payment integration. Most global builders are designed for Stripe or PayPal—which are not natively available in Nepal.
                </p>
                <div className="my-10 rounded-2xl border-l-4 border-blue-600 bg-blue-50 p-8">
                  <h3 className="mb-2 text-xl font-bold text-blue-900">Did you know?</h3>
                  <p className="text-blue-800">
                    Over 80% of online shoppers in Nepal prefer digital wallets like eSewa and Khalti over cash on delivery or international cards.
                  </p>
                </div>
                
                <h3 className="mb-4 mt-12 text-2xl font-bold text-slate-900">Popular Gateways in Nepal</h3>
                <div className="mt-8 space-y-6">
                  {gateways.map((gw, i) => (
                    <div key={i} className="flex gap-6 rounded-2xl border border-slate-100 p-6 shadow-sm transition-all hover:border-blue-200">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold ${gw.color}`}>
                        {gw.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">{gw.name}</h4>
                        <p className="mt-1 text-slate-600">{gw.description}</p>
                        <ul className="mt-4 flex flex-wrap gap-4">
                          {gw.features.map((f, j) => (
                            <li key={j} className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                              <Check className="h-4 w-4 text-green-500" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="mb-4 mt-16 text-2xl font-bold text-slate-900">How Nepdora Simplifies This</h3>
                <p>
                  Integrating these gateways manually requires advanced coding and a merchant account. With Nepdora, we provide pre-built integrations. You just need to enter your merchant ID, and you're ready to sell.
                </p>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl bg-slate-900 p-8 text-white">
                <Shield className="mb-6 h-10 w-10 text-blue-400" />
                <h3 className="mb-4 text-2xl font-bold">Ready to accept payments?</h3>
                <p className="mb-8 text-slate-400">
                  Build your online store with Nepdora and get native eSewa & Khalti integration from day one.
                </p>
                <Link 
                  href="/pricing"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-bold transition-all hover:bg-blue-700"
                >
                  Get Started Free <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="mt-10 flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-yellow-400" /> Zero Coding</span>
                  <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-green-400" /> Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with Global Platforms */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-12 text-3xl font-bold">Why Global Platforms Fail in Nepal</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-left">
                <h4 className="mb-4 font-bold text-red-600 flex items-center gap-2">
                  <X className="h-5 w-5" /> Shopify/Wix Problem
                </h4>
                <p className="text-slate-600">
                  Global builders don't support Nepali Rupees or local wallets. You're forced to use sub-optimal payment methods or expensive third-party integrations that slow down your site.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-left">
                <h4 className="mb-4 font-bold text-green-600 flex items-center gap-2">
                  <Check className="h-5 w-5" /> The Nepdora Advantage
                </h4>
                <p className="text-slate-600">
                  We are built for the local ecosystem. Your customers pay in NPR, via the apps they already have on their phones, with 100% success rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
