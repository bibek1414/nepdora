import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Integrated Khalti Payment Gateway for Your Website in Nepal",
  description:
    "Learn how to integrate Khalti payment gateway into your website. Nepdora provides native, one-click Khalti integration for all businesses in Nepal.",
  metadataBase: new URL(absoluteUrl()),
  alternates: {
    canonical: absoluteUrl("/khalti-payment-gateway-nepal"),
  },
  openGraph: {
    title: "Integrated Khalti Payment Gateway for Your Website in Nepal",
    description:
      "Learn how to integrate Khalti payment gateway into your website. Nepdora provides native, one-click Khalti integration for all businesses in Nepal.",
    url: absoluteUrl("/khalti-payment-gateway-nepal"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Khalti Integration for Nepal Websites",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khalti Integration for Nepal | Nepdora",
    description:
      "Step-by-step guide to integrate Khalti into your website in Nepal. Accept digital wallet payments easily.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
    <main className="min-h-screen bg-slate-50">
      <JsonLd id="khalti-guide-schema" data={khaltiSchema} />

      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-white py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#5C2D91]/10 px-3 py-1 text-sm font-bold text-[#5C2D91]">
            <ShieldCheck size={16} /> Verified Partner
          </div>
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Add <span className="text-[#5C2D91]">Khalti</span> Payment to Your
            Website
          </h1>
          <p className="mx-auto mb-0 max-w-2xl text-xl text-slate-600">
            Khalti is the fastest growing digital wallet in Nepal. Enable it on
            your store today with zero technical hurdles.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Compare Integration Experience
            </h2>
            <p className="text-slate-500">
              Stop worrying about SDKs and API keys. Focus on selling.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* The Hard Way */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3 text-slate-500">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-sm font-bold tracking-wider uppercase">
                  Manual SDK Setup
                </h2>
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "SDK Integration",
                    desc: "Manually importing and initializing Khalti scripts in your code.",
                  },
                  {
                    title: "Callback URLs",
                    desc: "Configuring server-side logic to handle success/failure signals.",
                  },
                  {
                    title: "Status Verification",
                    desc: "Implementing periodic API checks to verify transaction logs.",
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{step.title}</h4>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Nepdora Way */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#5C2D91]/20 bg-white p-8 shadow-xl">
              <div className="absolute top-0 right-0 rounded-bl-3xl bg-[#5C2D91] px-6 py-2 text-xs font-bold text-white">
                Native Plugin
              </div>
              <div className="mb-8 flex items-center gap-3 text-[#5C2D91]">
                <Zap className="h-6 w-6 fill-[#5C2D91]" />
                <h2 className="text-sm font-bold tracking-wider uppercase">
                  The Nepdora Way
                </h2>
              </div>
              <div className="space-y-8">
                {[
                  {
                    title: "Instant Activation",
                    desc: "Just enter your Khalti Secret Key in the admin panel.",
                    icon: <Rocket size={20} />,
                  },
                  {
                    title: "Automatic Webhooks",
                    desc: "We receive and process payment signals automatically.",
                    icon: <ShieldCheck size={20} />,
                  },
                  {
                    title: "Pre-built Checkout",
                    desc: "Native Khalti modal integrated into your existing flow.",
                    icon: <CheckCircle2 size={20} />,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#5C2D91]/10 text-[#5C2D91]">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </main>
  );
}
