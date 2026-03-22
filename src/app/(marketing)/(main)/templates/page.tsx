import TemplatesPage from "@/components/marketing/templates/templates-page";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nepdora : Professional Website Templates for Any Business in Nepal",
  description:
    "Browse hundreds of professionally designed website templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
  alternates: {
    canonical: "https://www.nepdora.com/templates",
  },
  keywords: [
    "website templates Nepal",
    "ecommerce templates",
    "restaurant website design",
    "agency website templates",
    "customizable website designs",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Nepdora : Professional Website Templates for Any Business in Nepal",
    description:
      "Browse hundreds of professionally designed website templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
    url: "https://www.nepdora.com/templates",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Professionally designed website templates from Nepdora",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora : Professional Website Templates for Any Business in Nepal",
    description:
      "Browse free templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
    images: ["https://www.nepdora.com/nepdora-image.jpg"],
  },
};

import { JsonLd } from "@/components/shared/json-ld";

const templatesSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Website Templates | Nepdora",
  description:
    "Explore professionally designed website templates for restaurants, agencies, and e-commerce stores in Nepal.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "E-commerce Templates",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Restaurant Templates",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Agency Templates",
      },
    ],
  },
};

export default function Templates() {
  return (
    <>
      <JsonLd id="templates-schema" data={templatesSchema} />
      <Suspense fallback={<div className="min-h-screen py-20" />}>
        <TemplatesPage />
      </Suspense>
      <div className="mb-40 py-20">
        <ContactSection />
      </div>
    </>
  );
}
