import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Rocket,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "eSewa Integration Guide for Websites in Nepal | Step-by-Step",
  description:
    "Complete guide on how to integrate eSewa into your business website. Start accepting payments from millions of eSewa users in Nepal today with Nepdora.",
  path: "/esewa-integration-guide-nepal",
  keywords: [
    "esewa integration nepal",
    "accept esewa payments",
    "nepal payment gateway guide",
    "digital wallet integration nepal",
  ],
});

const guideSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Integrate eSewa into Your Website in Nepal",
  description:
    "A comprehensive guide for merchants in Nepal to integrate eSewa payment gateway.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/esewa-integration-guide-nepal"),
  },
  step: [
    {
      "@type": "HowToStep",
      name: "Register as a Merchant",
      text: "Apply for an eSewa merchant account and complete KYC verification.",
    },
    {
      "@type": "HowToStep",
      name: "API Configuration",
      text: "Set up the eSewa API with your merchant credentials.",
    },
    {
      "@type": "HowToStep",
      name: "Start Accepting Payments",
      text: "Go live and start receiving payments from eSewa users.",
    },
  ],
};

export default function EsewaPage() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="esewa-guide-schema" data={guideSchema} />
      
      <StandardMarketingHero
        badgeText="Native integration"
        badgeIcon={ShieldCheck}
        title={
          <>
            Master <span className="text-[#60BB46]">eSewa</span> integration in Nepal
          </>
        }
        description="The ultimate guide for Nepali merchants to start accepting eSewa payments online without touching a single line of code."
        centered
      />

      {/* Comparison Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-extrabold text-slate-900 md:text-5xl">
              The integration breakdown
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500">
              Why spend weeks on development when you can go live in minutes?
              Experience the difference with Nepdora.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            {/* The Hard Way */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-10 flex items-center gap-4 text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-400">
                  Manual setup
                </h2>
              </div>
              <div className="space-y-8">
                {[
                  {
                    title: "Merchant registration",
                    desc: "Manual application and waiting for KYC verification.",
                  },
                  {
                    title: "API configuration",
                    desc: "Setting up hash generation and handling complex callbacks.",
                  },
                  {
                    title: "Sandbox testing",
                    desc: "Weeks of testing in UAT environments before production.",
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold text-slate-800">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Nepdora Way */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#60BB46] px-6 py-2 text-[10px] font-semibold tracking-wide text-white">
                One-click setup
              </div>
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#60BB46]/10 text-[#60BB46]">
                  <Zap className="h-6 w-6" fill="currentColor" />
                </div>
                <h2 className="text-sm font-semibold tracking-tight text-[#60BB46]">
                  The Nepdora way
                </h2>
              </div>
              <div className="space-y-10">
                {[
                  {
                    title: "Toggle eSewa on",
                    desc: "Enable the plugin from your Nepdora dashboard instantly.",
                    icon: <Rocket size={20} />,
                  },
                  {
                    title: "Enter merchant info",
                    desc: "Just paste your Merchant ID and you're ready.",
                    icon: <ShieldCheck size={20} />,
                  },
                  {
                    title: "Accept payments",
                    desc: "Automatic settlement and order status updates.",
                    icon: <CheckCircle2 size={20} />,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#60BB46]/10 text-[#60BB46]">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-base leading-relaxed text-slate-600">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      
      <StandardMarketingCTA
        title="Start accepting eSewa today"
        description="Join thousands of merchants across Nepal who trust Nepdora for their digital payments. Build your store for free."
        buttonText="Get started for free"
        buttonHref="/create-website"
      />
    </main>
  );
}
