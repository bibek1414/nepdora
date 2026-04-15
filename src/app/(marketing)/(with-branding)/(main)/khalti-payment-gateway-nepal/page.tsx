import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Smartphone,
  Lock,
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata = buildMarketingMetadata({
  title:
    "Khalti Payment Gateway Integration in Nepal | Easy Website Setup | Nepdora",
  description:
    "Integrate Khalti payment gateway into your website in minutes. Nepdora provides one-click setup for Nepali businesses to accept secure online payments easily.",
  path: "/khalti-payment-gateway-nepal",
  keywords: [
    "Khalti payment gateway Nepal",
    "Khalti integration website Nepal",
    "accept Khalti payments",
    "payment gateway integration Nepal",
    "Nepal digital wallet integration",
    "online payment Nepal website",
  ],
});

const khaltiSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Integrate Khalti into Your Website in Nepal",
  description:
    "A comprehensive guide for merchants in Nepal to integrate Khalti payment gateway.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  step: [
    {
      "@type": "HowToStep",
      name: "Register as a Merchant",
      text: "Apply for a Khalti merchant account and complete KYC verification.",
    },
    {
      "@type": "HowToStep",
      name: "API Configuration",
      text: "Set up the Khalti API with your secret keys.",
    },
    {
      "@type": "HowToStep",
      name: "Start Accepting Payments",
      text: "Go live and start receiving payments from Khalti users.",
    },
  ],
};

export default function KhaltiPage() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="khalti-guide-schema" data={khaltiSchema} />

      <MarketingPageHero
        badgeText="Verified Khalti Partner"
        badgeIcon={ShieldCheck}
        title={
          <>
            Accept <span className="text-[#5C2D91] italic">Khalti</span>{" "}
            payments. Instantly.
          </>
        }
        description="Khalti is the fastest growing digital wallet in Nepal. Enable it on your storefront today with our native, zero-code integration."
        breadcrumbs={[
          {
            label: "Khalti Integration",
            href: "/khalti-payment-gateway-nepal",
          },
        ]}
      />

      {/* Visual Comparison Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Stop worrying about <span className="text-rose-500">SDKs.</span>{" "}
                Focus on selling.
              </h2>
              <p className="mb-10 text-lg leading-relaxed font-medium text-slate-500">
                Integrating payment gateways used to require advanced
                engineering. With Nepdora, we've handled the heavy lifting so
                you don't have to.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#5C2D91]/10 text-[#5C2D91]">
                    <Zap className="h-5 w-5 fill-[#5C2D91]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Instant Activation
                    </h4>
                    <p className="text-sm text-slate-500">
                      Just enter your merchant keys and you're ready to go live.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Secure Webhooks
                    </h4>
                    <p className="text-sm text-slate-500">
                      Automatic payment verification and order status updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Mockup - Comparison/Dashboard */}
            <div className="relative">
              <div className="absolute inset-0 rotate-3 rounded-[56px] bg-[#5C2D91]/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-8 shadow-2xl">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5C2D91] font-bold text-white">
                    k
                  </div>
                  <span className="text-sm font-bold tracking-widest text-slate-900 uppercase">
                    Khalti Settings
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                      Public Key
                    </label>
                    <div className="flex h-10 w-full items-center rounded-xl border border-slate-100 bg-slate-50 px-4">
                      <div className="h-1.5 w-1/2 rounded bg-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                      Secret Key
                    </label>
                    <div className="flex h-10 w-full items-center rounded-xl border border-slate-100 bg-slate-50 px-4">
                      <div className="h-1.5 w-3/4 rounded bg-slate-200" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="w-full rounded-[20px] bg-[#5C2D91] py-4 text-center font-bold text-white shadow-xl shadow-[#5C2D91]/20">
                      Save & Connect
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Content */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="rounded-[48px] border border-slate-200 bg-white p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-50 text-slate-400">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                The Hard Way
              </h3>
              <p className="mb-8 leading-relaxed font-medium text-slate-500">
                Manually importing SDKs, configuring callback URLs, and
                implementing periodic API checks to verify transaction logs.
              </p>
              <ul className="space-y-4">
                {[
                  "Broken Callback Errors",
                  "Complex Handshakes",
                  "Security Vulnerabilities",
                ].map(item => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-400"
                  >
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[48px] border-2 border-[#5C2D91]/20 bg-white p-10 shadow-2xl shadow-[#5C2D91]/10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#5C2D91]/10 text-[#5C2D91]">
                <Zap className="h-6 w-6 fill-[#5C2D91]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#5C2D91]">
                The Nepdora Way
              </h3>
              <p className="mb-8 leading-relaxed font-medium text-slate-600">
                Native Khalti modal integrated into your existing checkout flow.
                We receive and process signals automatically.
              </p>
              <ul className="space-y-4">
                {[
                  "One-Click Setup",
                  "Automatic Webhooks",
                  "Native Checkout UX",
                ].map(item => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-[#5C2D91]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />

      <CTASection />
    </div>
  );
}
