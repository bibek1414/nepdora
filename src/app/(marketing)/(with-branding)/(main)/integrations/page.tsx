import { Metadata } from "next";
import Link from "next/link";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import IntegrationsMarketplace from "@/components/marketing/integrations/integrations-marketplace";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Website Integrations in Nepal | eSewa, Khalti, WhatsApp & More | Nepdora",
  description:
    "Connect your Nepdora website with powerful integrations in Nepal. Add eSewa, Khalti, Dash delivery, WhatsApp, analytics, and global tools in one click.",
  path: "/integrations",
});

export default function IntegrationsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Integrations Marketplace | Nepdora",
    description:
      "Explore eSewa, Khalti, WhatsApp and 50+ other integrations for your website.",
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

      <CTASection />
    </div>
  );
}
