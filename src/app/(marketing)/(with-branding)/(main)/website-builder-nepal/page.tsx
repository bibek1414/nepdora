import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import Hero from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import { TemplateSection } from "@/components/marketing/templates/template-section";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Best Website Builder in Nepal for Ecommerce, Services, and Brands",
  description:
    "Create a professional website in Nepal with Nepdora. Includes local payments, mobile-ready templates, hosting, and tools for Nepali businesses.",
  path: "/website-builder-nepal",
});

export default function WebsiteBuilderNepal() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} Website Builder`,
    description:
      "All-in-one website builder for Nepali businesses with local payment and delivery integration.",
    url: absoluteUrl(),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  return (
    <main>
      <JsonLd id="software-schema" data={schema} />
      <Hero />
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          Why Nepdora is the Best Website Builder in Nepal
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">
          Unlike global platforms like Wix or Shopify, Nepdora is built
          specifically for the Nepalese market. We provide native integration
          with eSewa, Khalti, and IME Pay, plus local logistics support for your
          e-commerce business.
        </p>
      </div>
      <FeaturesSection />
      <TemplateSection
        title="Start with a Professional Template"
        description="Choose from our library of high-converting designs for any business."
      />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
