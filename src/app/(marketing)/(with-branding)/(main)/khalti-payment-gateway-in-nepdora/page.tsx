import { Metadata } from "next";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  Smartphone,
  Lock,
  Globe,
  CreditCard,
  Landmark,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { KhaltiVisualMock } from "@/components/marketing/khalti/khalti-visual-mock";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "Khalti Payment Gateway Integration in Nepal | Nepdora",
  description:
    "Native, one-click Khalti integration for your business. Accept payments from millions of Khalti users in Nepal instantly with Nepdora's secure gateway.",
  path: "/khalti-payment-gateway-in-nepdora",
  keywords: [
    "khalti integration nepal",
    "payment gateway nepal",
    "accept khalti payments",
    "nepal digital wallet integration",
    "khalti api nepal",
  ],
});

const khaltiSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nepdora Khalti Integration",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  description:
    "Seamless Khalti payment gateway integration for websites in Nepal.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NPR",
  },
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
};

const guideSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Setup Khalti on Nepdora",
  step: [
    {
      "@type": "HowToStep",
      name: "Get API Keys",
      text: "Register on Khalti Merchant portal and obtain your Live Public and Secret keys.",
    },
    {
      "@type": "HowToStep",
      name: "Enter Keys in Nepdora",
      text: "Navigate to Settings > Payments in your Nepdora dashboard and paste your Khalti keys.",
    },
    {
      "@type": "HowToStep",
      name: "Go Live",
      text: "Toggle the Khalti integration to 'Active' and start accepting payments immediately.",
    },
  ],
};

export default function KhaltiPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#5C2D91]/10 selection:text-[#5C2D91]">
      <JsonLd id="khalti-app-schema" data={khaltiSchema} />
      <JsonLd id="khalti-guide-schema" data={guideSchema} />

      {/* Hero Section - Split Layout */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full bg-[#5C2D91]/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#5C2D91]/10 bg-[#5C2D91]/5 px-4 py-2 text-xs font-bold text-[#5C2D91]">
                <ShieldCheck className="h-4 w-4" />
                Verified Khalti Partner
              </div>
              <h1 className="mb-8 text-5xl leading-[0.95] font-black tracking-tighter text-slate-900 md:text-7xl">
                Accept <span className="text-[#5C2D91]">Khalti</span> <br />
                payments. <span className="text-slate-400">Instantly.</span>
              </h1>
              <p className="mb-10 max-w-lg text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
                Khalti is Nepal&apos;s fastest-growing digital wallet. Enable it
                on your storefront today with our native, one-click integration.
                No complex SDKs or coding required.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/signup"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#5C2D91] px-10 py-5 text-base font-bold text-white shadow-2xl shadow-[#5C2D91]/20 transition-all hover:scale-105 hover:shadow-[#5C2D91]/40 active:scale-95"
                >
                  Start Accepting Payments
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-10 py-5 text-base font-bold text-slate-900 transition-all hover:bg-slate-50"
                >
                  See How it Works
                </Link>
              </div>

              <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="w-full text-sm font-bold md:w-auto">
                  Trusted Integration Partners
                </div>
                <div className="flex items-center gap-8 opacity-40">
                  <span className="cursor-default text-xl font-black tracking-tighter">
                    Khalti
                  </span>
                  <span className="cursor-default text-xl font-black tracking-tighter">
                    Ime Pay
                  </span>
                  <span className="cursor-default text-xl font-black tracking-tighter">
                    Connect Ips
                  </span>
                </div>
              </div>
            </div>

            <div className="relative lg:block">
              <KhaltiVisualMock />
            </div>
          </div>
        </div>
      </section>

      {/* Nepdora Payments - Security Section */}
      <section className="py-10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
              Secure Payments with Nepdora
            </div>
            <h2 className="mt-4 mb-6 text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
              Built for Nepal, powered by{" "}
              <span className="text-[#5C2D91]">trusted payments</span>.
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Nepdora integrates with secure payment gateways like Khalti to
              provide seamless, fast, and reliable transactions. Whether
              you&apos;re selling products or managing a service, your payments
              are always protected.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: "Easy Checkout",
                desc: "Customers can pay instantly using Khalti with a smooth and mobile-friendly checkout experience.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Globe,
                title: "For Businesses",
                desc: "Accept payments directly on your Nepdora-powered website with secure Khalti integration.",
                color: "bg-[#5C2D91]/10 text-[#5C2D91]",
              },
              {
                icon: Lock,
                title: "Safe & Reliable",
                desc: "All transactions are encrypted and handled through trusted systems, ensuring maximum security.",
                color: "bg-green-50 text-green-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl"
              >
                <div
                  className={`h-16 w-16 rounded-2xl ${item.color} mb-8 flex items-center justify-center transition-transform group-hover:rotate-6`}
                >
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="leading-relaxed font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="how-it-works" className="overflow-hidden py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                    <Rocket className="h-24 w-24" />
                  </div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                      01
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">
                      The Hard Way
                    </h4>
                  </div>
                  <p className="mb-6 font-medium text-slate-500">
                    Manually importing SDKs, handling complex handshakes, and
                    implementing periodic API checks to verify transaction logs.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Broken Callback Errors",
                      "Complex Handshakes",
                      "Security Vulnerabilities",
                    ].map(item => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-bold text-slate-400"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="group relative overflow-hidden rounded-[32px] bg-[#5C2D91] p-8 text-white shadow-2xl shadow-[#5C2D91]/30">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <Zap className="h-24 w-24 fill-white" />
                  </div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-[#5C2D91]">
                      02
                    </div>
                    <h4 className="text-xl font-bold">The Nepdora Way</h4>
                  </div>
                  <p className="mb-6 font-medium text-white/80">
                    Native Khalti modal integrated into your existing checkout
                    flow. We receive and process signals automatically.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "One-Click Setup",
                      "Automatic Webhooks",
                      "Native Checkout UX",
                    ].map(item => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-bold"
                      >
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-8 text-5xl font-semibold text-slate-900 md:text-6xl">
                Stop worrying about SDKs. Focus on selling.
              </h2>
              <p className="mb-10 text-xl leading-relaxed font-medium text-slate-500">
                Integrating payment gateways used to require advanced
                engineering. With Nepdora, we&apos;ve handled the heavy lifting
                so you don&apos;t have to.
              </p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5C2D91]/10 text-[#5C2D91]">
                    <Zap className="h-6 w-6 fill-[#5C2D91]" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-bold text-slate-900">
                      Instant Activation
                    </h4>
                    <p className="font-medium text-slate-500">
                      Just enter your merchant keys and you&apos;re ready to go
                      live in seconds.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-bold text-slate-900">
                      Secure Webhooks
                    </h4>
                    <p className="font-medium text-slate-500">
                      Automatic payment verification and order status updates
                      without manual checks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative overflow-hidden bg-white py-24 text-slate-900 md:py-32">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-[#5C2D91]/5 blur-[120px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                Nepdora Payments
              </div>

              <h2 className="mt-4 mb-6 text-5xl leading-none font-black tracking-tighter text-slate-900">
                Secure and seamless <br />
                <span className="text-[#5C2D91]">checkout in Nepal.</span>
              </h2>

              <p className="text-lg font-medium text-slate-500">
                Nepdora integrates with trusted gateways like Khalti to provide
                fast, reliable, and secure payment experiences for your
                customers across Nepal.
              </p>
            </div>

            <Link
              href="/features"
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
            >
              Explore all features
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[40px] border border-slate-200 bg-slate-100 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Smartphone,
                title: "Khalti Wallet",
                desc: "Enable fast payments using Khalti wallet for a smooth mobile-first experience.",
              },
              {
                icon: Landmark,
                title: "Bank Payments",
                desc: "Accept payments from all major Nepali banks with secure integration.",
              },
              {
                icon: CreditCard,
                title: "Cards Support",
                desc: "Allow customers to pay using debit and credit cards securely via Khalti.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Checkout",
                desc: "Real-time verification ensures every transaction is safe and reliable.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white p-12 transition-all hover:bg-slate-50"
              >
                <item.icon className="mb-8 h-10 w-10 text-[#5C2D91] transition-transform group-hover:scale-110" />
                <h3 className="mb-4 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Simple & Clean */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-20 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
              Support & FAQ
            </div>

            <h2 className="mt-4 mb-4 text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
              Common Questions
            </h2>

            <p className="text-lg font-medium text-slate-500">
              Everything you need to know about payments and integrations on
              Nepdora.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                q: "Do I need a Khalti Merchant account?",
                a: "Yes. You’ll need a Khalti merchant account to receive API credentials. Once you add them to Nepdora, your payment system is ready in minutes with full guidance provided.",
              },
              {
                q: "Are there any extra charges?",
                a: "No extra charges from Nepdora. You only pay the standard transaction fees set by Khalti. All payments are settled directly to your linked bank account.",
              },
              {
                q: "Is it secure for my customers?",
                a: "Yes. Payments are handled through Khalti’s secure PCI-DSS compliant system. Nepdora never stores sensitive data like OTPs, PINs, or card details.",
              },
              {
                q: "What payment methods are supported?",
                a: "Nepdora supports Khalti wallet, e-banking, and debit/credit cards (SCT/Visa), ensuring a smooth checkout experience for your customers in Nepal.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-colors hover:border-[#5C2D91]/30"
              >
                <h4 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5C2D91]/10 text-xs text-[#5C2D91]">
                    Q
                  </div>
                  {item.q}
                </h4>

                <div className="pl-11">
                  <p className="leading-relaxed font-medium text-slate-600">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-[64px] bg-white px-8 py-24 text-center text-black">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="mb-8 max-w-4xl text-5xl leading-[0.9] font-semibold tracking-tighter">
                Ready to accept payments with Khalti?
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-xl font-medium text-black/80">
                Join hundreds of businesses in Nepal who have already simplified
                their payment processes with Nepdora.
              </p>
              <Link
                href="/admin/signup"
                className="inline-flex items-center gap-3 rounded-full bg-[#5C2D91] px-12 py-6 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Build Your Website Now
                <ChevronRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
