import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
  description:
    "See the comprehensive features that power your digital presence: web hosting, online store setup, analytics, and centralized social media management.",
  alternates: {
    canonical: absoluteUrl("/features"),
  },
  keywords: [
    "Nepdora features",
    "website builder features",
    "ecommerce tools",
    "social media management",
    "web hosting Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL(absoluteUrl()),
  openGraph: {
    title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
    description:
      "See the comprehensive features that power your digital presence: web hosting, online store setup, analytics, and centralized social media management.",
    url: absoluteUrl("/features"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora's powerful website and e-commerce features",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
    description:
      "Explore features like web hosting, online store setup, analytics, and centralized social media management.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
