import TemplatesPage from "@/components/marketing/templates/templates-page";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { Suspense } from "react";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora : Professional Website Templates for Any Business in Nepal",
  description:
    "Browse hundreds of professionally designed website templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
  path: "/templates",
  keywords: [
    "website templates Nepal",
    "ecommerce templates",
    "restaurant website design",
    "agency website templates",
    "customizable website designs",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";
import { TemplateHero } from "@/components/marketing/templates/template-hero";

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
      name: "Templates",
      item: absoluteUrl("/templates"),
    },
  ],
};

import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

export default function Templates() {
  return (
    <>
      <JsonLd id="templates-schema" data={templatesSchema} />
      <JsonLd id="templates-breadcrumb" data={breadcrumbSchema} />

      <TemplateHero categoryName="All" />
      <Suspense fallback={<div className="min-h-screen py-20" />}>
        <TemplatesPage asH1={true} />
      </Suspense>
      <div className="mb-40 py-20">
        <ContactSection />
      </div>
    </>
  );
}
