import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  ShieldCheck,
  Globe,
  Zap,
  AlertCircle,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INTEGRATIONS.map(integration => ({
    slug: integration.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const integration = INTEGRATIONS.find(i => i.slug === slug);

  if (!integration) return notFound();

  return buildMarketingMetadata({
    title: `${integration.name} Integration for your Website | Nepdora`,
    description: `Connect ${integration.name} with your Nepdora store. ${integration.description} Seamless setup for businesses in Nepal.`,
    path: `/integrations/${slug}`,
    ogLabel: "Integration Spotlight",
  });
}

export default async function IntegrationPage({ params }: Props) {
  const { slug } = await params;
  const integration = INTEGRATIONS.find(i => i.slug === slug);

  if (!integration) return notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-white pt-24 pb-20 text-slate-900">
        <div className="container mx-auto max-w-6xl px-4 text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <Breadcrumbs
              items={[
                { label: "Integrations", href: "/integrations" },
                { label: integration.name, href: `/integrations/${slug}` },
              ]}
            />
          </div>

          <div className="mt-12 flex flex-col items-center md:flex-row md:gap-12 md:text-left">
            <div className="mb-10 flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 md:mb-0 md:h-44 md:w-44">
              <Image
                src={integration.logo}
                alt={integration.name}
                width={176}
                height={176}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex-1">
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: `${integration.color}10`,
                  color: integration.color,
                }}
              >
                <ShieldCheck size={18} /> {integration.badge}
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
                Connect{" "}
                <span style={{ color: integration.color }}>
                  {integration.name}
                </span>{" "}
                easily
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:mx-0 md:text-xl">
                {integration.longDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl">
              The integration breakdown
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500">
              Why spend weeks on development when you can go live in minutes?
              Experience the difference with Nepdora.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            {/* The Hard Way */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
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
                    title: "Technical setup",
                    desc: "Manually importing scripts and matching API specifications.",
                  },
                  {
                    title: "Security & validation",
                    desc: "Implementing hash generation and sensitive data encryption.",
                  },
                  {
                    title: "Maintenance",
                    desc: "Constant updates to keep up with changing provider APIs.",
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
              <div
                className="absolute top-0 right-0 rounded-bl-2xl px-6 py-2 text-[10px] font-semibold tracking-wide text-white"
                style={{ backgroundColor: integration.color }}
              >
                Zero code
              </div>
              <div className="mb-10 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${integration.color}10`,
                    color: integration.color,
                  }}
                >
                  <Zap className="h-6 w-6" fill="currentColor" />
                </div>
                <h2
                  className="text-sm font-semibold tracking-tight"
                  style={{ color: integration.color }}
                >
                  The Nepdora way
                </h2>
              </div>
              <div className="space-y-10">
                {[
                  {
                    title: "Instant activation",
                    desc: "Enable the integration from your dashboard with one click.",
                    icon: <Rocket size={20} />,
                  },
                  {
                    title: "Auto configuration",
                    desc: "No code needed. Just enter your credentials and you're set.",
                    icon: <ShieldCheck size={20} />,
                  },
                  {
                    title: "Always up-to-date",
                    desc: "We handle all API updates so your site never stops working.",
                    icon: <CheckCircle2 size={20} />,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
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
            </div>
          </div>
        </div>
      </section>

      {/* Features & Detailed Info */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div className="space-y-16 lg:col-span-2">
              {/* Features Grid */}
              <div>
                <h2 className="mb-12 flex items-center gap-4 text-3xl font-bold text-slate-900">
                  <span
                    className="block h-8 w-1 rounded-full"
                    style={{ backgroundColor: integration.color }}
                  />
                  Powerful features
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {integration.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50"
                    >
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-transform group-hover:scale-110">
                        <Zap className="h-5 w-5 text-sky-500" />
                      </div>
                      <p className="text-base font-bold text-slate-800">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="mb-12 flex items-center gap-4 text-3xl font-bold text-slate-900">
                  <span className="block h-8 w-1 rounded-full bg-amber-500" />
                  Why you need this
                </h2>
                <div className="grid gap-3">
                  {integration.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition-colors hover:bg-slate-50"
                    >
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
                      <p className="text-lg font-medium text-slate-700">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
                  <h3 className="mb-4 text-2xl leading-tight font-bold">
                    Start using {integration.name}
                  </h3>
                  <p className="mb-8 text-base leading-relaxed font-medium text-slate-600">
                    Connect your {integration.name} account to your Nepdora site
                    in just a few clicks. No developer needed.
                  </p>
                  <Link
                    href="/create-website"
                    className="group mb-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-base font-bold text-white transition-all hover:bg-slate-800"
                  >
                    Build your site for free
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                  </Link>
                  <p className="text-center text-[10px] font-semibold tracking-wide text-slate-400">
                    Available on all plans
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
                  <h4 className="mb-6 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                    <Globe className="h-5 w-5 text-slate-400" />
                    Quick links
                  </h4>
                  <div className="space-y-4">
                    <a
                      href={integration.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-base font-medium text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Official website
                      <ChevronRight size={16} className="text-slate-300" />
                    </a>
                    <Link
                      href="/support"
                      className="flex items-center justify-between text-base font-medium text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Setup tutorial
                      <ChevronRight size={16} className="text-slate-300" />
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center justify-between text-base font-medium text-slate-600 transition-colors hover:text-slate-900"
                    >
                      Pricing and fees
                      <ChevronRight size={16} className="text-slate-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggest Tool / CTA Section */}
      <section className="border-t border-slate-100 bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 px-8 py-16 text-center md:px-16 md:py-24">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-100/50 blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-50/30 blur-[100px]" />

            <h2 className="relative z-10 mb-6 text-3xl font-extrabold text-slate-900 md:text-5xl">
              Missing a tool?
            </h2>
            <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg leading-relaxed font-medium text-slate-500">
              We're constantly adding new integrations. If you need a specific
              tool connected to your Nepdora site, reach out to our team.
            </p>
            <Link
              href="/contact"
              className="relative z-10 inline-flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
            >
              Request an integration
              <ChevronRight className="h-5 w-5 text-sky-400" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
