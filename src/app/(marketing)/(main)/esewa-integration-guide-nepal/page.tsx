import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "eSewa Integration Guide for Websites in Nepal | Step-by-Step",
  description:
    "Complete guide on how to integrate eSewa into your business website. Start accepting payments from millions of eSewa users in Nepal today with Nepdora.",
};

export default function EsewaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-white py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#60BB46]/10 px-3 py-1 text-sm font-bold text-[#60BB46]">
            <ShieldCheck size={16} /> Native Integration
          </div>
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Master <span className="text-[#60BB46]">eSewa</span> Integration in
            Nepal
          </h1>
          <p className="mx-auto mb-0 max-w-2xl text-xl text-slate-600">
            The ultimate guide for Nepali merchants to start accepting eSewa
            payments online without touching a single line of code.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              The Integration Breakdown
            </h2>
            <p className="text-slate-500">
              Why spend weeks on development when you can go live in minutes?
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* The Hard Way */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3 text-slate-500">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-sm font-bold tracking-wider uppercase">
                  The Hard Way
                </h2>
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "Merchant Registration",
                    desc: "Manual application and waiting for KYC verification.",
                  },
                  {
                    title: "API Configuration",
                    desc: "Setting up hash generation and handling complex callbacks.",
                  },
                  {
                    title: "Sandbox Testing",
                    desc: "Weeks of testing in UAT environments before production.",
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
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#60BB46]/20 bg-white p-8 shadow-xl">
              <div className="absolute top-0 right-0 rounded-bl-3xl bg-[#60BB46] px-6 py-2 text-xs font-bold text-white">
                One-Click Setup
              </div>
              <div className="mb-8 flex items-center gap-3 text-[#60BB46]">
                <Zap className="h-6 w-6 fill-[#60BB46]" />
                <h2 className="text-sm font-bold tracking-wider uppercase">
                  The Nepdora Way
                </h2>
              </div>
              <div className="space-y-8">
                {[
                  {
                    title: "Toggle eSewa On",
                    desc: "Enable the plugin from your Nepdora dashboard instantly.",
                    icon: <Rocket size={20} />,
                  },
                  {
                    title: "Enter Merchant Info",
                    desc: "Just paste your Merchant ID and you're ready.",
                    icon: <ShieldCheck size={20} />,
                  },
                  {
                    title: "Accept Payments",
                    desc: "Automatic settlement and order status updates.",
                    icon: <CheckCircle2 size={20} />,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#60BB46]/10 text-[#60BB46]">
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
