import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Delivery & Pathao Integration for E-commerce in Nepal",
  description:
    "Automate your shipping with Pathao and other local delivery partners in Nepal. Integrated logistics tracking for your online store.",
  path: "/solutions/local-delivery-integration-pathao",
});

const solutionSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Local Delivery Integration Nepal",
  description:
    "Automated logistics integration with Pathao and courier services for websites in Nepal.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
};

export default function DeliverySolution() {
  return (
    <main className="bg-white py-16 md:py-24">
      <JsonLd id="delivery-solution-schema" data={solutionSchema} />
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-extrabold md:text-6xl">
          Automated <span className="text-primary">Pathao</span> & Logistics
          Integration
        </h1>
        <div className="prose prose-slate lg:prose-xl">
          <p>
            Manage your deliveries as easily as your sales. Nepdora integrates
            directly with Pathao and local courier services to automate your
            fulfillment.
          </p>
          <h2>How it works:</h2>
          <ol>
            <li>Order comes in on your website.</li>
            <li>Automatic booking with logistics partner.</li>
            <li>Customer gets tracking link via SMS.</li>
            <li>Status updates automatically in your dashboard.</li>
          </ol>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
