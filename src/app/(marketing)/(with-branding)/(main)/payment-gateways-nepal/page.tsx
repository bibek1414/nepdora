import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
import Link from "next/link";
import { Check, Shield, Zap, CreditCard, ChevronRight, X, Lock, Smartphone } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";

export const metadata = buildMarketingMetadata({
  title:
    "Complete Guide to Payment Gateways in Nepal | eSewa, Khalti, ConnectIPS",
  description:
    "Learn how to accept online payments in Nepal. A comprehensive guide to eSewa, Khalti, and IME Pay integration for your website with Nepdora.",
  path: "/payment-gateways-nepal",
  ogTitle: "Accepting Online Payments in Nepal: The Ultimate Guide",
  ogSubtitle:
    "Everything you need to know about eSewa, Khalti and local bank integration.",
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
        title={<>Accept <span className="text-primary italic">local payments.</span> Grow local sales.</>}
        description="Stop losing customers because you don't have an international credit card. Accept eSewa, Khalti, and Fonepay natively on your website."
        breadcrumbs={[{ label: "Payments", href: "/payment-gateways-nepal" }]}
      />

      {/* Visual Mockup - The Checkout Experience */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for the way Nepal shops.
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-500">
                80% of online shoppers in Nepal prefer digital wallets over cards.
                Nepdora comes with these integrations pre-built, so you can start 
                accepting payments in minutes, not weeks.
              </p>
              
              <div className="space-y-6">
                 <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900">Mobile-First Checkout</h4>
                       <p className="text-sm text-slate-500">Optimized for eSewa and Khalti mobile apps for a 2-click payment experience.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                       <Lock className="h-5 w-5" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900">PCIDSS Level Security</h4>
                       <p className="text-sm text-slate-500">Secure transactions with instant verification and automatic delivery triggers.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Visual Mockup: Checkout UI */}
            <div className="relative">
               <div className="absolute inset-0 bg-primary/20 rounded-[48px] rotate-3 blur-2xl" />
               <div className="relative bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden max-w-[360px] mx-auto">
                  <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                     <span className="text-sm font-bold opacity-50">Checkout</span>
                     <span className="text-sm font-bold">Total: Rs. 1,500</span>
                  </div>
                  <div className="p-8 space-y-6">
                     <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Payment Method</span>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-primary bg-primary/5">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">e</div>
                                 <span className="font-bold text-slate-900">eSewa Wallet</span>
                              </div>
                              <div className="h-4 w-4 rounded-full border-4 border-primary" />
                           </div>
                           <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 grayscale opacity-50">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">k</div>
                                 <span className="font-bold text-slate-900">Khalti</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20">
                        Pay with eSewa
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Popular gateways we support.
          </h2>
          <p className="text-lg text-slate-500">Everything you need to accept payments from 20M+ users in Nepal.</p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {gateways.map((gw, i) => (
              <div
                key={i}
                className="group p-8 rounded-[32px] border border-slate-200 bg-white transition-all hover:shadow-2xl hover:shadow-slate-200/50"
              >
                <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl font-black text-2xl text-white ${gw.color} shadow-lg transition-transform group-hover:scale-110`}>
                  {gw.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">
                  {gw.name}
                </h4>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  {gw.description}
                </p>
                <ul className="space-y-3">
                  {gw.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent)]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <h2 className="mb-12 text-3xl font-bold md:text-5xl">
            Why global platforms fail in Nepal.
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 text-left">
            <div className="p-10 rounded-[40px] border border-slate-800 bg-slate-800/50 backdrop-blur-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                <X className="h-6 w-6" />
              </div>
              <h4 className="mb-4 text-2xl font-bold">Shopify/Wix Issues</h4>
              <p className="text-slate-400 leading-relaxed font-medium">
                They don't support Nepali Rupees or local wallets natively.
                You are forced to use sub-optimal methods or expensive
                third-party bridges that break during high traffic.
              </p>
            </div>
            <div className="p-10 rounded-[40px] border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="mb-4 text-2xl font-bold">The Nepdora Edge</h4>
              <p className="text-slate-400 leading-relaxed font-medium">
                We are built for the local ecosystem. Your customers pay in
                NPR via the apps they already use, ensuring 100% 
                success rates and instant settlement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
         <div className="container mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center gap-12 rounded-[48px] border border-slate-200 bg-white p-12 shadow-2xl md:flex-row">
               <div className="bg-primary/10 flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px]">
                  <Zap className="text-primary h-10 w-10 fill-primary" />
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h2 className="mb-4 text-3xl font-bold">
                     Ready to accept payments?
                  </h2>
                  <p className="mb-0 text-lg leading-relaxed text-slate-500">
                     Build your online store with Nepdora today and get native eSewa & 
                     Khalti integration from day one. Zero coding required.
                  </p>
               </div>
               <Link
                  href="/pricing"
                  className="shrink-0 rounded-2xl bg-slate-900 px-10 py-5 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
               >
                  Get Started Free
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

