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
const PLATFORM_NAME = "Shopify";
const pageUrl = absoluteUrl("/alternative/shopify-nepal");
const pageTitle =
  "Shopify vs Nepdora (2026): Best Ecommerce Platform for Nepal?";
const pageDescription =
  "Choosing between Shopify and Nepdora in Nepal? Compare local payment gateways (eSewa, Khalti), NPR pricing, logistics sync, and ease of use for Nepali merchants.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "shopify alternative nepal",
    "shopify vs nepdora",
    "ecommerce platform nepal",
    "esewa shopify nepal",
    "khalti shopify nepal",
    "best online store builder nepal",
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/shopify-vs-nepdora.png", // Replace with actual asset if available
        width: 1200,
        height: 630,
        alt: "Shopify vs Nepdora — Best ecommerce platform in Nepal 2026",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
};

export default function ShopifyAlternativePage() {
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nepdora",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Nepdora is the leading Shopify alternative in Nepal, providing built-in eSewa/Khalti integrations and NPR-based pricing specifically for the local market.",
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
      opponent: "Requires 3rd party plugins / apps",
    },
    {
      feature: "Monthly Pricing",
      nepdora: "NPR 10,000 / year (Flat)",
      opponent: "$29 USD+ / month (NPR 3,800+)",
    },
    {
      feature: "Transaction Fees",
      nepdora: "0% (Only PG fees)",
      opponent: "Up to 2% (unless using Shopify Payments)",
    },
    {
      feature: "Ease of Use",
      nepdora: "AI builder creates store in minutes",
      opponent: "Steep learning curve / custom theme",
    },
    {
      feature: "Logistics",
      nepdora: "Native Pathao/YDM/Dash sync",
      opponent: "App-based integrations",
    },
  ];

  const reasons = [
    {
      title: "No International Credit Card Needed",
      description:
        "Paying for Shopify in USD requires a Dollar Card. Nepdora accepts all local Nepali payment methods for your subscription.",
    },
    {
      title: "Built for Nepali Logistics",
      description:
        "Unlike Shopify's US-centric apps, Nepdora integrates directly with local providers like Pathao and Dash for automated shipping.",
    },
    {
      title: "Native Payment Gateways",
      description:
        "Accept eSewa and Khalti without paying for expensive 3rd party connector apps that often break or slow down checkout.",
    },
    {
      title: "24/7 Local Support",
      description:
        "Get technical help from a team in Kathmandu that understands the local banking and commercial environment.",
    },
  ];

  const testimonials = [
    {
      quote:
        "We tried Shopify but the dollar payment and lack of local eSewa integration made it difficult. Nepdora solved everything in one afternoon.",
      name: "Trend Nepal",
      role: "E-commerce Store, Lalitpur",
      href: "#",
    },
  ];

  const fitChecks = [
    "You want to pay for your platform in NPR, not USD.",
    "You need eSewa and Khalti integrated without coding.",
    "You want zero transaction fees on your sales.",
    "You need a platform that syncs with local Nepal logistics.",
  ];

  const clusterLinks = [
    { label: "Blanxer vs Nepdora", href: "/alternative/blanxer-nepal" },
    { label: "WordPress vs Nepdora", href: "/alternative/wordpress-nepal" },
    { label: "Wix vs Nepdora", href: "/alternative/wix-nepal" },
    { label: "Webflow vs Nepdora", href: "/alternative/webflow-nepal" },
  ];

  return (
    <main>
      <JsonLd id="shopify-alt-software-schema" data={softwareAppSchema} />

      <AlternativeHero
        platformName={PLATFORM_NAME}
        description="Shopify is the world's leading ecommerce tool, but for Nepal, international payments and local integrations can be a barrier. See how Nepdora compares."
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
        traditionalCostLabel="Shopify Basic (Annual)"
        traditionalCostValue="NPR 55,000+ per year"
        traditionalPoints={[
          "Subscription: ~$400/year (NPR 53,000)",
          "Payment Apps: NPR 5,000+/year",
          "Transaction Fees: 2% per sale",
          "Theme Cost: $180+ (Optional)",
        ]}
        nepdoraPoints={[
          "Subscription: NPR 10,000/year",
          "Local Payments: Included",
          "Transaction Fees: 0%",
          "Premium Themes: Included",
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
