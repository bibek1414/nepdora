import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Website Builder Pricing Nepal | Free Plan + Paid Upgrades | Nepdora",
  description:
    "Compare Nepdora pricing for websites, ecommerce, and business tools in Nepal. Start free, upgrade only when you need more features.",
  path: "/pricing",
  keywords: [
    "Nepdora pricing",
    "website cost Nepal",
    "ecommerce pricing",
    "free website builder",
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
      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Pricing", href: "/pricing" }]} />
      </div>
      <PricingHero />
      <PricingSectionHero initialPlans={plans} />
      <PricingCalculator />
      <PricingComparisonLinks />
    </>
  );
}
