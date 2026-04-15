import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Website Builder Pricing in Nepal (Free & Paid Plans) | Nepdora",
  description:
    "Explore Nepdora website builder pricing in Nepal. Start free and upgrade anytime. Includes hosting, ecommerce tools, and local payments like Khalti and eSewa.",
  path: "/pricing",
  keywords: [
    "website builder pricing Nepal",
    "website cost Nepal",
    "Nepdora pricing",
    "free website builder Nepal",
    "ecommerce website cost Nepal",
    "affordable website builder Nepal",
    "no code website builder Nepal",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Nepdora Pricing Plans",
  description:
    "Compare Nepdora's affordable and transparent pricing plans for businesses of all sizes in Nepal.",
  mainEntity: {
    "@type": "Offer",
    priceCurrency: "NPR",
    offeredBy: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl(),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: absoluteUrl("/pricing"),
    },
  ],
};

export const dynamic = "force-dynamic";
import PricingSectionHero from "@/components/marketing/pricing-section/pricing-section-hero";
import PricingCalculator from "@/components/marketing/pricing-section/pricing-calculator";
import { subscriptionApi } from "@/services/api/subscription";
import PricingHero from "@/components/marketing/pricing-section/pricing-hero-header";
import PricingComparisonLinks from "@/components/marketing/pricing-section/pricing-comparison-links";

import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

export default async function PricingPage() {
  const plans = await subscriptionApi.getPlans().catch(() => []);

  return (
    <>
      <JsonLd id="pricing-schema" data={pricingSchema} />
      <JsonLd id="pricing-breadcrumb" data={breadcrumbSchema} />
      <PricingHero />
      <PricingSectionHero initialPlans={plans} />
      <PricingCalculator />
      <PricingComparisonLinks />
    </>
  );
}
