import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  Check,
  Shield,
  Zap,
  CreditCard,
  ChevronRight,
  X,
  Lock,
  Smartphone,
} from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata = buildMarketingMetadata({
  title: "Payment Gateways in Nepal | eSewa, Khalti & IME Pay Guide | Nepdora",
  description:
    "Learn how to accept online payments in Nepal using eSewa, Khalti, and IME Pay. Step-by-step guide to integrating payment gateways into your website with Nepdora.",
  path: "/payment-gateways-nepal",
  ogTitle: "How to Accept Online Payments in Nepal",
  ogSubtitle:
    "Complete guide to eSewa, Khalti, IME Pay & bank payment integration for websites.",
});

export default function PaymentGatewaysPage() {
  const gateways = [
    {
      name: "eSewa",
      description:
        "Nepal's first and largest digital wallet. Essential for any online business.",
      features: ["Highest User Base", "Secure SDK", "Instant Settlement"],
      color: "bg-green-600",
      icon: "e",
    },
    {
      name: "Khalti",
      description:
        "Modern, developer-friendly payment gateway with excellent UI/UX.",
      features: [
        "Quick Integration",
        "Multiple Payment Methods",
        "Great Reporting",
      ],
      color: "bg-purple-600",
      icon: "k",
    },
    {
      name: "ConnectIPS",
      description: "Direct bank-to-bank transfers for high-value transactions.",
      features: [
        "Low Fees",
        "Direct Bank Account Search",
        "Reliable Infrastructure",
      ],
      color: "bg-blue-800",
      icon: "c",
    },
  ];

  const gatewaySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Guide to Payment Gateways in Nepal",
    description: "Learn about integration of eSewa, Khalti and more in Nepal.",
    author: { "@type": "Organization", name: "Nepdora" },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="gateway-schema" data={gatewaySchema} />

      <MarketingPageHero
        badgeText="Payments in Nepal"
        badgeIcon={CreditCard}
        title={
          <>
            Accept <span className="text-primary italic">local payments.</span>{" "}
            Grow local sales.
          </>
        }
        description="Stop losing customers because you don't have an international credit card. Accept eSewa, Khalti, and Fonepay natively on your website."
        breadcrumbs={[{ label: "Payments", href: "/payment-gateways-nepal" }]}
      />

      {/* Visual Mockup - The Checkout Experience */}
      <section className="overflow-hidden bg-slate-50 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for the way Nepal shops.
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-500">
                80% of online shoppers in Nepal prefer digital wallets over
                cards. Nepdora comes with these integrations pre-built, so you
                can start accepting payments in minutes, not weeks.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Mobile-First Checkout
                    </h4>
                    <p className="text-sm text-slate-500">
                      Optimized for eSewa and Khalti mobile apps for a 2-click
                      payment experience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      PCIDSS Level Security
                    </h4>
                    <p className="text-sm text-slate-500">
                      Secure transactions with instant verification and
                      automatic delivery triggers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Mockup: Checkout UI */}
            <div className="relative">
              <div className="bg-primary/20 absolute inset-0 rotate-3 rounded-[48px] blur-2xl" />
              <div className="relative mx-auto max-w-[360px] overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-slate-900 p-6 text-white">
                  <span className="text-sm font-bold opacity-50">Checkout</span>
                  <span className="text-sm font-bold">Total: Rs. 1,500</span>
                </div>
                <div className="space-y-6 p-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Select Payment Method
                    </span>
                    <div className="space-y-2">
                      <div className="border-primary bg-primary/5 flex items-center justify-between rounded-2xl border-2 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 font-bold text-white">
                            e
                          </div>
                          <span className="font-bold text-slate-900">
                            eSewa Wallet
                          </span>
                        </div>
                        <div className="border-primary h-4 w-4 rounded-full border-4" />
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 opacity-50 grayscale">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 font-bold text-white">
                            k
                          </div>
                          <span className="font-bold text-slate-900">
                            Khalti
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/admin/signup" className="block w-full">
                    <button className="bg-primary shadow-primary/20 w-full rounded-2xl py-4 font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95">
                      Pay with eSewa
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <section className="py-24">
        <div className="container mx-auto mb-16 max-w-5xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Popular gateways we support.
          </h2>
          <p className="text-lg text-slate-500">
            Everything you need to accept payments from 20M+ users in Nepal.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {gateways.map((gw, i) => (
              <div
                key={i}
                className="group rounded-[32px] border border-slate-200 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50"
              >
                <div
                  className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white ${gw.color} shadow-lg transition-transform group-hover:scale-110`}
                >
                  {gw.icon}
                </div>
                <h4 className="mb-2 text-2xl font-bold text-slate-900">
                  {gw.name}
                </h4>
                <p className="mb-6 leading-relaxed text-slate-500">
                  {gw.description}
                </p>
                <ul className="space-y-3">
                  {gw.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <Check className="text-primary h-4 w-4" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent)]" />
        <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold md:text-5xl">
            Why global platforms fail in Nepal.
          </h2>

          <div className="grid gap-8 text-left md:grid-cols-2">
            <div className="rounded-[40px] border border-slate-800 bg-slate-800/50 p-10 backdrop-blur-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                <X className="h-6 w-6" />
              </div>
              <h4 className="mb-4 text-2xl font-bold">Shopify/Wix Issues</h4>
              <p className="leading-relaxed font-medium text-slate-400">
                They don't support Nepali Rupees or local wallets natively. You
                are forced to use sub-optimal methods or expensive third-party
                bridges that break during high traffic.
              </p>
            </div>
            <div className="border-primary/20 bg-primary/5 rounded-[40px] border p-10 backdrop-blur-sm">
              <div className="bg-primary/10 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="mb-4 text-2xl font-bold">The Nepdora Edge</h4>
              <p className="leading-relaxed font-medium text-slate-400">
                We are built for the local ecosystem. Your customers pay in NPR
                via the apps they already use, ensuring 100% success rates and
                instant settlement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
