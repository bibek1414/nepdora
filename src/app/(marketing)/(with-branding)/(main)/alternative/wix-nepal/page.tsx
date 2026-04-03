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
const PLATFORM_NAME = "Wix";
const pageUrl = absoluteUrl("/alternative/wix-nepal");
const pageTitle = "Wix vs Nepdora (2026): Best Website Builder in Nepal?";
const pageDescription =
  "Comparing Wix and Nepdora in Nepal? See why businesses are switching to Nepdora for its native eSewa/Khalti payments and faster local performance.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "wix alternative nepal",
    "wix vs nepdora",
    "website builder nepal",
    "esewa wix nepal",
    "khalti wix nepal",
    "best business website nepal",
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/wix-vs-nepdora.png", // Replace with actual asset if available
        width: 1200,
        height: 630,
        alt: "Wix vs Nepdora — Best website platform in Nepal 2026",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
};

export default function WixAlternativePage() {
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nepdora",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Nepdora is the best Wix alternative in Nepal, featuring local payment gateway support and optimized SEO performance for regional businesses.",
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
      feature: "Local Payments",
      nepdora: "Built-in (eSewa, Khalti, Fonepay)",
      opponent: "Requires custom integration / not natively supported",
    },
    {
      feature: "Monthly Pricing",
      nepdora: "NPR 10,000 / year (Flat)",
      opponent: "$16+ / month (NPR 2,100+) for Basic eCommerce",
    },
    {
      feature: "Page Load Speed",
      nepdora: "Optimized for Nepal bandwidth / local CDNs",
      opponent: "Heavy scripts / slower international servers",
    },
    {
      feature: "Ease of Use",
      nepdora: "AI builder creates store in minutes",
      opponent: "Drag and drop (but can be clunky)",
    },
    {
      feature: "SEO Control",
      nepdora: "Automated JSON-LD & meta optimization",
      opponent: "Manual setup / heavy code impact",
    },
  ];

  const reasons = [
    {
      title: "No International Credit Card Needed",
      description:
        "Unlike Wix, which requires a Dollar Card for its premium plans, you can pay for Nepdora using any local Nepali card or wallet.",
    },
    {
      title: "Built-in Payment Gateway Apps",
      description:
        "Accept payments directly with eSewa and Khalti on your Nepdora site without complex third-party configurations.",
    },
    {
      title: "Optimized Performance",
      description:
        "Nepdora is built for the local market, ensuring faster loading speeds even on average internet connections compared to the heavy scripts that Wix uses.",
    },
    {
      title: "Hands-on Local Support",
      description:
        "Get direct support from our local Kathmandu team instead of waiting for days on international support tickets.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Wix was too slow for our users and the eSewa setup was impossible. Nepdora solved both issues in one afternoon.",
      name: "Nepal Tours",
      role: "Tourism Business, Kathmandu",
      href: "#",
    },
  ];

  const fitChecks = [
    "You want to pay in local currency (NPR) instead of USD.",
    "You need native eSewa and Khalti integrations.",
    "You want a faster-loading website for customers in Nepal.",
    "You want simple, predictable annual costs with no hidden fees.",
  ];

  const clusterLinks = [
    { label: "Blanxer vs Nepdora", href: "/alternative/blanxer-nepal" },
    { label: "Shopify vs Nepdora", href: "/alternative/shopify-nepal" },
    { label: "WordPress vs Nepdora", href: "/alternative/wordpress-nepal" },
    { label: "Webflow vs Nepdora", href: "/alternative/webflow-nepal" },
  ];

  return (
    <main>
      <JsonLd id="wix-alt-software-schema" data={softwareAppSchema} />

      <AlternativeHero
        platformName={PLATFORM_NAME}
        description="Wix features a powerful drag-and-drop builder, but it can be slow and lacks the native payment support required by businesses in Nepal. See the difference with Nepdora."
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
        traditionalCostLabel="Wix Basic Business (Annual)"
        traditionalCostValue="NPR 25,000+ per year"
        traditionalPoints={[
          "Subscription: ~$192/year (NPR 25,500)",
          "Domain: NPR 2,000/year (after 1st year)",
          "App Market plugins: Varies",
          "International Payment fees: Included",
        ]}
        nepdoraPoints={[
          "All-in-one: NPR 10,000/year",
          "Domain + SSL: Included",
          "Native eSewa/Khalti: Included",
          "Zero maintenance",
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
