import { InvoiceBuilder } from "@/components/marketing/tools/invoice-builder";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import { FileText } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMarketingMetadata({
    title: "Professional Invoice Builder for Nepal | Free & Instant | Nepdora",
    description:
      "Create and download professional invoices for your business in Nepal instantly. Free invoice templates for freelancers, agencies, and small businesses.",
    path: "/invoice-builder",
  });
}

export default function InvoiceBuilderPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nepdora Invoice Builder",
    description: "Free and instant professional invoice builder for Nepal.",
    url: absoluteUrl("/invoice-builder"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="invoice-builder-schema" data={schema} />

      <StandardMarketingHero
        badgeText="Free billing tool"
        badgeIcon={FileText}
        title={
          <>
            Professional <span className="text-sky-600">invoice builder.</span>
          </>
        }
        description="Create and download professional invoices for your business in Nepal instantly. Free and instant."
        centered
      />

      <div className="bg-slate-50 py-20">
        <InvoiceBuilder />
      </div>

      <StandardMarketingCTA
        title="Ready to automate your billing?"
        description="Build a high-performance website with integrated payments in 2 minutes. Start building for free with Nepdora."
        buttonText="Get started for free"
        buttonHref="/create-website"
      />
    </main>
  );
}
