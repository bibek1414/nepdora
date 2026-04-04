import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
  description:
    "Build your E-Commerce website in Nepal for free with Nepdora. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.",
  path: "/ecommerce",
  keywords: [
    "ecommerce website Nepal",
    "online store Nepal",
    "Nepdora ecommerce",
    "sell online Nepal",
    "website builder features",
    "ecommerce tools",
  ],
});

const ecommerceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora E-commerce Website Builder",
  description:
    "A comprehensive e-commerce platform for businesses in Nepal to start selling online with integrated payments and inventory management.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  areaServed: "NP",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "E-commerce Features",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Order Management",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Inventory System",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Payment Gateway Integration",
        },
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd id="ecommerce-schema" data={ecommerceSchema} />
      <CitiesLandingPage category="ecommerce" city="nepal" />
    </>
  );
}
