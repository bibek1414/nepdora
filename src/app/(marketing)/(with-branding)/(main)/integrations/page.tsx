import { Metadata } from "next";
import Link from "next/link";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import IntegrationsMarketplace from "@/components/marketing/integrations/integrations-marketplace";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Integrations Marketplace | Connect Your Business with Nepdora",
  description:
    "Explore and connect the best local and global tools to your Nepdora website. eSewa, Khalti, Dash Logistics, WhatsApp, and more.",
  path: "/integrations",
});

export default function IntegrationsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Integrations Marketplace | Nepdora",
    description: "Explore eSewa, Khalti, WhatsApp and 50+ other integrations for your website.",
    url: absoluteUrl("/integrations"),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <JsonLd id="integrations-schema" data={schema} />
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Everything you need to{" "}
              <span className="text-primary">grow your business.</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Connect your Nepdora website with the best local and global tools.
              Automate your workflow, accept payments, and scale faster.
            </p>
          </div>
        </div>
      </section>

      <IntegrationsMarketplace integrations={INTEGRATIONS} />

      {/* CTA Section - Clean */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to connect?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Can't find the tool you're looking for? We're constantly adding
                new integrations to help you succeed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
                >
                  Request Integration
                </Link>
                <Link
                  href="/create-website"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
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
