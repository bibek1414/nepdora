import type { Metadata } from "next";
import { AlternativeHero } from "@/components/marketing/alternative/alternative-hero";
import { AlternativeTable } from "@/components/marketing/alternative/alternative-table";
import { AlternativeValueProps } from "@/components/marketing/alternative/alternative-value-props";
import { AlternativePricing } from "@/components/marketing/alternative/alternative-pricing";
import { AlternativeTestimonials } from "@/components/marketing/alternative/alternative-testimonials";
import { AlternativeFitCheck } from "@/components/marketing/alternative/alternative-fit-check";
import { AlternativeLinkCluster } from "@/components/marketing/alternative/alternative-link-cluster";
import Comparison from "@/components/marketing/comparison/comparison";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

// ─── Page-level constants ────────────────────────────────────────────────────
const PLATFORM_NAME = "Webflow";
const pageUrl = absoluteUrl("/alternative/webflow-nepal");
const pageTitle =
  "Webflow vs Nepdora (2026): Best Design-First Platform for Nepal?";
const pageDescription =
  "Comparing Webflow and Nepdora in Nepal? See why businesses are switching to Nepdora for its native eSewa/Khalti payments and faster local build times.";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/alternative/webflow-nepal",
  image: "/webflow-vs-nepdora.png",
  keywords: [
    "webflow alternative nepal",
    "webflow vs nepdora",
    "website builder nepal",
    "esewa webflow nepal",
    "khalti webflow nepal",
  ],
});

export default function WebflowAlternativePage() {
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nepdora",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Nepdora is the best Webflow alternative in Nepal, providing a simpler, more automated path for design-focused companies that need eSewa and Khalti integrations.",
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: "10000",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "15000",
    },
  };

  const comparisonRows = [
    {
      feature: "Setup Speed",
      nepdora: "Minutes (AI builder)",
      opponent: "Days to Weeks (High learning curve)",
    },
    {
      feature: "Local Payments",
      nepdora: "Built-in (eSewa, Khalti, Fonepay)",
      opponent: "Requires complex manual integration",
    },
    {
      feature: "Pricing (Annual)",
      nepdora: "NPR 10,000 (Flat)",
      opponent: "$192+ (NPR 25,000+) excluding CMS/eComm",
    },
    {
      feature: "Maintenance",
      nepdora: "Zero (SaaS platform)",
      opponent: "Requires technical updates / export management",
    },
    {
      feature: "Ease of Use",
      nepdora: "One-sentence prompt creates store",
      opponent: "Requires HTML/CSS/Design knowledge",
    },
  ];

  const reasons = [
    {
      title: "No International Credit Card Needed",
      description:
        "Unlike Webflow, which requires a Dollar Card for its CMS and ecommerce plans, you can pay for Nepdora with any local Nepali wallet.",
    },
    {
      title: "Built-in Local Payments",
      description:
        "Accept eSewa and Khalti natively without the high cost of third-party payment apps or custom coding.",
    },
    {
      title: "AI-Powered Creation",
      description:
        "Start with a live website built by AI in seconds, rather than choosing from generic templates that require hours of professional design work.",
    },
    {
      title: "Hands-on Local Support",
      description:
        "Get direct support from a local team in Kathmandu instead of waiting for days on international support tickets.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Webflow was too hard to manage internally. Nepdora simplified our design flow and the eSewa integration was seamless.",
      name: "Modern Agency",
      role: "Design Studio, Kathmandu",
      href: "#",
    },
  ];

  const fitChecks = [
    "You want to pay for your platform in NPR, not USD.",
    "You need native eSewa and Khalti integrations.",
    "You want a faster-loading website with zero technical debt.",
    "You want simple, predictable annual costs with no hidden fees.",
  ];

  const clusterLinks = [
    { label: "Blanxer vs Nepdora", href: "/alternative/blanxer-nepal" },
    { label: "Shopify vs Nepdora", href: "/alternative/shopify-nepal" },
    { label: "WordPress vs Nepdora", href: "/alternative/wordpress-nepal" },
    { label: "Wix vs Nepdora", href: "/alternative/wix-nepal" },
  ];

  return (
    <main>
      <JsonLd id="webflow-alt-software-schema" data={softwareAppSchema} />

      <AlternativeHero
        platformName={PLATFORM_NAME}
        description="Webflow is a designer's dream, but it can be technically demanding and lacks the local payment support essential for the Nepal market. See the difference with Nepdora."
      />

      <Comparison platformName={PLATFORM_NAME} />

      <AlternativeTable platformName={PLATFORM_NAME} rows={comparisonRows} />

      <AlternativeValueProps
        platformName={PLATFORM_NAME}
        reasons={reasons}
        featureLinks={[]}
      />

      <AlternativePricing
        platformName={PLATFORM_NAME}
        traditionalCostLabel="Webflow CMS (Annual)"
        traditionalCostValue="NPR 30,000+ per year"
        traditionalPoints={[
          "CMS Subscription: ~$288/year (NPR 38,000)",
          "E-commerce addon: $29/mo+ extra",
          "Domain & SSL: Included (CMS plan)",
          "Template Cost: $49 - $129 (Optional)",
        ]}
        nepdoraPoints={[
          "All-in-one: NPR 10,000/year",
          "Everything Included: Domain + Hosting + SSL",
          "Native eSewa/Khalti: Included",
          "Zero design skills needed",
        ]}
      />

      <AlternativeTestimonials testimonials={testimonials} />

      <AlternativeFitCheck platformName={PLATFORM_NAME} fitChecks={fitChecks} />

      <AlternativeLinkCluster links={clusterLinks} />

      <FAQSection />
      <CTASection />
    </main>
  );
}
