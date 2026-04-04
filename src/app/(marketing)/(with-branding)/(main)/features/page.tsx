import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
  description:
    "See the comprehensive features that power your digital presence: web hosting, online store setup, analytics, and centralized social media management.",
  path: "/features",
  keywords: [
    "Nepdora features",
    "website builder features",
    "ecommerce tools",
    "social media management",
    "web hosting Nepal",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";

const featuresSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Platform Features",
  description:
    "Comprehensive suite of digital tools including a drag-and-drop website builder, e-commerce solutions, and centralized social media management.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital Solutions",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Builder",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-commerce System",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Social Media Management",
        },
      },
    ],
  },
};

import FeaturesGrid from "@/components/marketing/features-section/FeaturesGrid";

export default function FeaturesPage() {
  return (
    <>
      <JsonLd id="features-schema" data={featuresSchema} />
      <FeaturesGrid />
    </>
  );
}
