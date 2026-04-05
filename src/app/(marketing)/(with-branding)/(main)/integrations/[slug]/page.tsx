import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, CheckCircle2, ShieldCheck, Globe, Zap } from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

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
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <section className="border-b border-slate-100 bg-slate-50/50 pt-24 pb-20">
        <div className="container mx-auto max-w-7xl px-4">
          <Breadcrumbs
            items={[
              { label: "Integrations", href: "/integrations" },
              { label: integration.name, href: `/integrations/${slug}` },
            ]}
          />

          <div className="mt-12 flex flex-col items-start gap-12 md:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 md:h-32 md:w-32">
              <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
            <div className="max-w-3xl">
              <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                {integration.name} <span className="text-slate-400">&</span>{" "}
                Nepdora
              </h1>
              <p className="mb-0 text-xl leading-relaxed text-slate-600 md:text-2xl">
                {integration.longDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-3">
            <div className="space-y-16 lg:col-span-2">
              {/* Features Grid */}
              <div>
                <h2 className="mb-10 border-l-4 border-sky-500 pl-6 text-3xl font-bold text-slate-900">
                  Powerful Features
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {integration.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-sky-200 hover:bg-sky-50/30"
                    >
                      <div className="rounded-lg border border-slate-200 bg-white p-2">
                        <Zap className="h-5 w-5 text-sky-500" />
                      </div>
                      <p className="font-semibold text-slate-800">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="mb-10 border-l-4 border-amber-500 pl-6 text-3xl font-bold text-slate-900">
                  Why you need this
                </h2>
                <div className="space-y-6">
                  {integration.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-xl border border-dashed border-slate-200 p-5"
                    >
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
                      <p className="text-lg text-slate-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="relative overflow-hidden rounded-[32px] bg-sky-950 p-8 text-white">
                <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 text-sky-900/50" />
                <h3 className="relative z-10 mb-4 text-2xl font-bold">
                  Safe & Secure
                </h3>
                <p className="relative z-10 max-w-lg text-sky-200/80">
                  Our integration with {integration.name} follows the highest
                  security standards. All sensitive data is encrypted and
                  handled according to local and international regulations.
                </p>
              </div>
            </div>

            {/* Sidebar Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-2xl shadow-slate-200">
                  <h3 className="mb-6 text-2xl font-bold">
                    Start using {integration.name}
                  </h3>
                  <p className="mb-8 text-slate-600">
                    Connect your {integration.name} account to your Nepdora site
                    in just a few clicks. No developer needed.
                  </p>
                  <Link
                    href="/create-website"
                    className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 font-bold text-white transition-all hover:bg-slate-800"
                  >
                    Build your site for free
                    <MoveRight className="h-5 w-5" />
                  </Link>
                  <p className="text-center text-xs font-medium tracking-widest text-slate-400 uppercase">
                    Available on all plans
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
                  <h4 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Globe className="h-4 w-4" />
                    Integration Links
                  </h4>
                  <div className="space-y-3">
                    <a
                      href={integration.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary block text-slate-600 underline decoration-slate-200 transition-colors"
                    >
                      Official {integration.name} Website
                    </a>
                    <Link
                      href="/support"
                      className="hover:text-primary block text-slate-600 underline decoration-slate-200 transition-colors"
                    >
                      Setup Tutorial
                    </Link>
                    <Link
                      href="/pricing"
                      className="hover:text-primary block text-slate-600 underline decoration-slate-200 transition-colors"
                    >
                      Pricing and Fees
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
