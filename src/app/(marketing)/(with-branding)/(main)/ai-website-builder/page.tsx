import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import Hero from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "AI Website Builder Nepal | Build Your Site with Artificial Intelligence",
  description:
    "Experience the power of AI to build your website in minutes. The first AI-powered website builder for Nepal that understands your local business needs.",
  path: "/ai-website-builder",
  keywords: [
    "ai website builder nepal",
    "artificial intelligence website builder",
    "auto build website nepal",
  ],
});

export default function AIWebsiteBuilder() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} AI Website Builder`,
    description:
      "The first AI-powered website builder for Nepal. Tell us your business name and we build the rest.",
    url: absoluteUrl("/ai-website-builder"),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  return (
    <main>
      <JsonLd id="ai-software-schema" data={schema} />
      <Hero />
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          The Future of Website Building in Nepal
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">
          Forget complex editors. Simply describe your business, and our AI will
          generate a custom layout, write localized content for Nepal, and
          optimize your images automatically.
        </p>
      </div>
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
