import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, CheckCircle2, ShieldCheck, Globe, Zap } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INTEGRATIONS.map((integration) => ({
    slug: integration.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const integration = INTEGRATIONS.find((i) => i.slug === slug);

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
  const integration = INTEGRATIONS.find((i) => i.slug === slug);

  if (!integration) return notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Header */}
      <section className="pt-32 pb-20 border-b border-slate-100 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl px-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-10">
            <Link href="/integrations" className="hover:text-primary transition-colors">Integrations</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 capitalize">{integration.category}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center p-6 shrink-0">
              <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                {integration.name} <span className="text-slate-400">&</span> Nepdora
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-0">
                {integration.longDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-16">
              {/* Features Grid */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-10 border-l-4 border-sky-500 pl-6">
                  Powerful Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integration.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-sky-200 hover:bg-sky-50/30 transition-all">
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <Zap className="w-5 h-5 text-sky-500" />
                      </div>
                      <p className="text-slate-800 font-semibold">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-10 border-l-4 border-amber-500 pl-6">
                  Why you need this
                </h2>
                <div className="space-y-6">
                  {integration.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                      <p className="text-slate-700 text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="p-8 rounded-[32px] bg-sky-950 text-white relative overflow-hidden">
                <ShieldCheck className="absolute -right-8 -bottom-8 w-48 h-48 text-sky-900/50" />
                <h3 className="text-2xl font-bold mb-4 relative z-10">Safe & Secure</h3>
                <p className="text-sky-200/80 max-w-lg relative z-10">
                  Our integration with {integration.name} follows the highest security standards. All sensitive data is encrypted and handled according to local and international regulations.
                </p>
              </div>
            </div>

            {/* Sidebar Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="p-8 rounded-3xl border-2 border-slate-900 bg-white shadow-2xl shadow-slate-200">
                  <h3 className="text-2xl font-bold mb-6">Start using {integration.name}</h3>
                  <p className="text-slate-600 mb-8">
                    Connect your {integration.name} account to your Nepdora site in just a few clicks. No developer needed.
                  </p>
                  <Link 
                    href="/create-website"
                    className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all mb-4"
                  >
                    Build your site for free
                    <MoveRight className="w-5 h-5" />
                  </Link>
                  <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
                    Available on all plans
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Integration Links
                  </h4>
                  <div className="space-y-3">
                    <a href={integration.website} target="_blank" rel="noopener noreferrer" className="block text-slate-600 hover:text-primary underline decoration-slate-200 transition-colors">
                      Official {integration.name} Website
                    </a>
                    <Link href="/support" className="block text-slate-600 hover:text-primary underline decoration-slate-200 transition-colors">
                      Setup Tutorial
                    </Link>
                    <Link href="/pricing" className="block text-slate-600 hover:text-primary underline decoration-slate-200 transition-colors">
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
