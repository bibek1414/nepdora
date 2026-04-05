import { Metadata } from "next";
import Script from "next/script";
import { TemplatesHero } from "@/components/marketing/templates/templates-hero";
import TemplatesPage from "@/components/marketing/templates/templates-page";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: `Website Templates - Customizable HTML Templates | ${SITE_NAME}`,
  description: `Explore our curated collection of professional HTML website templates. Fully customizable, responsive, and designed to help you launch your website in minutes with ${SITE_NAME}.`,
  path: "/website-templates",
  keywords: [
    "website templates",
    "HTML templates",
    "responsive website design",
    "customizable templates",
    `${SITE_NAME} templates`,
    "portfolio templates",
    "business templates",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";

export default function WebsiteTemplatesPage() {
  const templateSchema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    name: `${SITE_NAME} Website Templates`,
    description: `A collection of high-quality, customizable website templates for every industry powered by ${SITE_NAME}.`,
    numberOfItems: 50,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "Professional Portfolio Template",
          applicationCategory: "Web Design Template",
          operatingSystem: "Web",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "Business Landing Page Template",
          applicationCategory: "Web Design Template",
          operatingSystem: "Web",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd id="schema-templates" data={templateSchema} />

      <div className="bg-white">
        <TemplatesHero />

        <TemplatesPage />
      </div>
    </>
  );
}
