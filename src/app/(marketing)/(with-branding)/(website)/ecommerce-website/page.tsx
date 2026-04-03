import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
  description:
    "Build your E-Commerce website in Nepal for free with Nepdora. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.",
  keywords: [
    "ecommerce website Nepal",
    "online store Nepal",
    "Nepdora ecommerce",
    "sell online Nepal",
    "website builder features",
    "ecommerce tools",
  ],
  alternates: {
    canonical: absoluteUrl("/ecommerce-website"),
  },
  openGraph: {
    title:
      "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
    description:
      "Build your E-Commerce website in Nepal for free with Nepdora. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.",
    url: absoluteUrl("/ecommerce-website"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora - Build Free E-Commerce Website in Nepal",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
    description:
      "Build your E-Commerce website in Nepal for free with Nepdora. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
