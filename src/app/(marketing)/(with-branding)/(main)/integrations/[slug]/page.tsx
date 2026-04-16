import React from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Zap,
  Settings,
  ShieldCheck,
  Rocket,
  Globe,
} from "lucide-react";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import {
  IntegrationHero,
  IntegrationShowcaseSection,
  ConnectionMockup,
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

  const integrationSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${integration.name} Integration`,
    description: integration.description,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Setup ${integration.name} on Nepdora`,
    step: [
      {
        "@type": "HowToStep",
        name: "Enter API Keys",
        text: `Securely input your ${integration.name} credentials into your Nepdora dashboard.`,
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Toggle Activation",
        text: "Enable the integration with a single click.",
        position: 2,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="integration-service-schema" data={integrationSchema} />
      <JsonLd id="integration-howto-schema" data={howToSchema} />
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

      {/* Comparison Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why use our integration?
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Skip the technical complexity and go live in minutes with our
              native, zero-code connection.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-8">
            {/* The Hard Way */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  The Hard Way
                </h3>
              </div>
              <div className="space-y-6">
                {integration.hardWay.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-slate-800">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl border border-rose-100 bg-rose-50 p-4">
                <p className="text-sm text-rose-700">
                  Requires technical expertise, weeks of development, and
                  ongoing maintenance costs.
                </p>
              </div>
            </div>

            {/* The Nepdora Way */}
            <div className="border-primary/20 -sm relative rounded-2xl border-2 bg-white p-8">
              <div
                className="absolute -top-3 right-6 rounded-full px-4 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: integration.color }}
              >
                Zero Code
              </div>
              <div className="mb-8 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${integration.color}15`,
                    color: integration.color,
                  }}
                >
                  <Rocket className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  The Nepdora Way
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "Instant activation",
                    desc: "Turn on the integration with a single click from your dashboard.",
                    icon: <Settings size={18} />,
                  },
                  {
                    title: "No coding required",
                    desc: "Simply enter your API keys and we handle all the technical plumbing.",
                    icon: <Zap size={18} />,
                  },
                  {
                    title: "Updates included",
                    desc: "We monitor and update the integration so it never stops working.",
                    icon: <ShieldCheck size={18} />,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${integration.color}10`,
                        color: integration.color,
                      }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Zero Coding Required</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Active in 5 Minutes</span>
                </div>
              </div>

              <div className="mt-8">
                <div
                  className="-md rounded-xl p-5 text-white"
                  style={{ backgroundColor: integration.color }}
                >
                  <p className="leading-relaxed font-medium text-white/90">
                    "With Nepdora, {integration.name} is ready to use from day
                    one. Focus on your business, not the code."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Resources */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Benefits Column */}
            <div className="lg:col-span-2">
              <div>
                <h2 className="mb-8 text-2xl font-bold text-slate-900">
                  Key Benefits
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {integration.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="-sm flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="mt-12">
                <h4 className="mb-6 text-xl font-semibold text-slate-900">
                  Integration Resources
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Link
                    href={integration.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      Official site
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/support"
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      Setup Guide
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      Pricing Plans
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="-sm sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  Trusted by Nepali Sellers
                </h3>
                <p className="mb-6 text-sm leading-relaxed font-medium text-slate-500">
                  Nepdora simplifies {integration.slug.split("-")[0]} for local
                  businesses. Join the network leading the digital revolution in
                  Nepal.
                </p>
                <Link
                  href="/admin/signup"
                  className="bg-primary block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:scale-105"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
