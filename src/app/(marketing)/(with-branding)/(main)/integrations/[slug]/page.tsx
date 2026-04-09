import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Zap, 
  Settings, 
  ShieldCheck, 
  Rocket,
  Globe
} from "lucide-react";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import { 
  IntegrationHero, 
  IntegrationShowcaseSection, 
  ConnectionMockup 
} from "@/components/marketing/integrations/integration-sections";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const integration = INTEGRATIONS.find(i => i.slug === slug);
  
  if (!integration) return {};

  return buildMarketingMetadata({
    title: `${integration.name} Integration for Nepdora | Setup Guide`,
    description: integration.description,
    path: `/integrations/${slug}`,
  });
}

export default async function IntegrationDetailsPage({ params }: Props) {
  const { slug } = await params;
  const integration = INTEGRATIONS.find(i => i.slug === slug);

  if (!integration) return notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <IntegrationHero 
        name={integration.name}
        logo={integration.logo}
        color={integration.color}
        badge={integration.badge}
        title={integration.heroTitle}
        subtitle={integration.heroSubtitle}
        description={integration.longDescription}
      />

      {/* Dynamic Showcase Sections */}
      {integration.showcaseSections?.map((section, idx) => (
        <IntegrationShowcaseSection
          key={idx}
          title={section.title}
          description={section.description}
          bullets={section.bullets}
          image={section.image}
          visual={
            // Show ConnectionMockup for the first section OR if the title mentions 'Activation' or 'Connection'
            idx === 0 || section.title.toLowerCase().includes("activation") ? (
              <ConnectionMockup 
                activeName={integration.name}
                activeLogo={integration.logo}
                color={integration.color}
              />
            ) : undefined
          }
          flip={idx % 2 !== 0}
          color={integration.color}
        />
      ))}

      {/* Comparison Section (Hard Way vs Nepdora Way) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl">
              Why use our integration?
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500">
              Skip the technical complexity and go live in minutes with our native, zero-code connection.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* The Hard Way */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-wider uppercase">The Hard Way</h3>
              </div>
              <div className="space-y-8">
                {integration.hardWay.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== integration.hardWay.length - 1 && (
                      <div className="absolute top-10 left-2.5 h-full w-px bg-slate-100" />
                    )}
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 z-10">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="mb-1 text-base font-bold text-slate-800">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm text-red-700 italic">
                  Requires technical expertise, weeks of development, and ongoing maintenance costs.
                </p>
              </div>
            </div>

            {/* The Nepdora Way */}
            <div className="relative overflow-hidden rounded-[32px] border-2 border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/50">
              <div
                className="absolute top-0 right-0 rounded-bl-2xl px-6 py-2 text-[10px] font-bold tracking-widest text-white uppercase"
                style={{ backgroundColor: integration.color }}
              >
                Zero Code
              </div>
              <div className="mb-10 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${integration.color}15`,
                    color: integration.color,
                  }}
                >
                  <Rocket className="h-6 w-6" fill="currentColor" />
                </div>
                <h3 
                  className="text-lg font-bold tracking-wider uppercase text-slate-900"
                >
                  The Nepdora Way
                </h3>
              </div>
              <div className="space-y-10">
                {[
                  {
                    title: "Instant activation",
                    desc: "Turn on the integration with a single click from your dashboard.",
                    icon: <Settings size={20} />,
                  },
                  {
                    title: "No coding required",
                    desc: "Simply enter your API keys and we handle all the technical plumbing.",
                    icon: <Zap size={20} />,
                  },
                  {
                    title: "Updates included",
                    desc: "We monitor and update the integration so it never stops working.",
                    icon: <ShieldCheck size={20} />,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${integration.color}10`,
                        color: integration.color,
                      }}
                    >
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
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Zero Coding Required</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Active in 5 Minutes</span>
                </div>
              </div>

              <div className="mt-10">
                <div 
                  className="rounded-2xl p-6 text-white shadow-lg shadow-slate-200"
                  style={{ backgroundColor: integration.color }}
                >
                  <p className="leading-relaxed font-semibold italic text-white/90">
                    "With Nepdora, {integration.name} is ready to use from day one. Focus on your business, not the code."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Resources */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
             {/* Benefits Column */}
             <div className="lg:col-span-2 space-y-20">
               <div>
                <h2 className="mb-12 flex items-center gap-4 text-3xl font-bold text-slate-900">
                  <span className="block h-8 w-1 rounded-full bg-emerald-500" />
                  Key Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integration.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-2xl border border-slate-50 p-6 transition-all hover:bg-slate-50 active:scale-95"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                         <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <p className="text-base font-bold text-slate-700">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

               {/* Resources */}
               <div>
                <h4 className="mb-8 flex items-center gap-2.5 text-2xl font-bold text-slate-900">
                  <Globe className="h-6 w-6 text-slate-400" />
                  Integration Resources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    href={integration.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-8 transition-all hover:bg-slate-50 hover:border-slate-200 group"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Website</span>
                    <span className="text-lg font-bold text-slate-900 flex items-center justify-between">
                      Official site
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/support"
                    className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-8 transition-all hover:bg-slate-50 hover:border-slate-200 group"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Docs</span>
                    <span className="text-lg font-bold text-slate-900 flex items-center justify-between">
                      Setup Guide
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-8 transition-all hover:bg-slate-50 hover:border-slate-200 group"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cost</span>
                    <span className="text-lg font-bold text-slate-900 flex items-center justify-between">
                      Pricing Plans
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar / Last section - minimalist info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-[40px] bg-slate-50 p-10 border border-slate-100">
                  <h3 className="mb-6 text-2xl font-bold text-slate-900">
                    Trusted by Nepali Sellers
                  </h3>
                  <p className="text-base font-medium text-slate-500 leading-relaxed">
                    Nepdora simplifies {integration.slug.split('-')[0]} for local businesses. Join the network leading the digital revolution in Nepal.
                  </p>
                  <div className="mt-10 pt-10 border-t border-slate-200">
                    <Link 
                      href="/register"
                      className="block w-full text-center py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm tracking-wider uppercase transition-transform hover:scale-105 active:scale-95"
                    >
                      Start Free Trial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
