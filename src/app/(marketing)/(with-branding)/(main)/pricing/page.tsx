import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Nepdora Pricing: Start Free, Upgrade for More Features",
  description:
    "Start for FREE! Compare Nepdora's transparent pricing plans for website development, e-commerce, and social media tools. Only pay as you grow.",
  alternates: {
    canonical: absoluteUrl("/pricing"),
  },
  keywords: [
    "Nepdora pricing",
    "website cost Nepal",
    "ecommerce pricing",
    "free website builder",
    "affordable web design",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL(absoluteUrl()),
  openGraph: {
    title: "Nepdora Pricing: Start Free, Upgrade for More Features",
    description:
      "Start for FREE! Compare Nepdora's transparent pricing plans for website development, e-commerce, and social media tools. Only pay as you grow.",
    url: absoluteUrl("/pricing"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora's transparent and flexible pricing plans",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora Pricing: Start Free, Upgrade for More Features",
    description:
      "Start for FREE! Compare Nepdora's transparent pricing plans and only pay as you grow.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
import { subscriptionApi } from "@/services/api/subscription";

export default async function PricingPage() {
  const plans = await subscriptionApi.getPlans().catch(() => []);

  return (
    <>
      <JsonLd id="pricing-schema" data={pricingSchema} />
      <PricingSectionHero initialPlans={plans} />
    </>
  );
}
