import { Metadata } from "next";
import Link from "next/link";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import IntegrationsMarketplace from "@/components/marketing/integrations/integrations-marketplace";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Integrations Marketplace | Connect Your Business with Nepdora",
  description:
    "Explore and connect the best local and global tools to your Nepdora website. eSewa, Khalti, Dash Logistics, WhatsApp, and more.",
  path: "/integrations",
});

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-32 pb-24">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-sky-50/50 blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-50/30 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
              Everything you need to <br />
              <span className="bg-linear-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                grow your business.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-slate-500">
              Connect your Nepdora website with the best local and global tools.
              Automate your workflow, accept payments, and scale faster.
            </p>
          </div>
        </div>
      </section>

      <IntegrationsMarketplace integrations={INTEGRATIONS} />

      {/* Modern CTA Section */}
      <section className="bg-white py-32">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-[40px] bg-slate-900 px-8 py-20 text-center md:px-16 md:py-28">
            {/* CTA Background Patterns */}
            <div className="absolute top-0 right-0 h-full w-1/3 bg-linear-to-l from-sky-500/20 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 h-full w-1/3 bg-linear-to-r from-indigo-500/20 to-transparent opacity-50" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl font-extrabold text-white md:text-6xl">
                Ready to connect?
              </h2>
              <p className="mb-12 text-xl leading-relaxed text-slate-400">
                Can't find the tool you're looking for? We're constantly adding
                new integrations to help you succeed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:scale-105 hover:bg-slate-50"
                >
                  Request Integration
                </Link>
                <Link
                  href="/create-website"
                  className="rounded-full border border-slate-700 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
                >
                  Build your site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
