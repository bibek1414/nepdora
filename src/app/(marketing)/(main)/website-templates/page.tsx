import { Metadata } from "next";
import Script from "next/script";
import { TemplatesHero } from "@/components/marketing/templates/templates-hero";
import TemplatesPage from "@/components/marketing/templates/templates-page";

export const metadata: Metadata = {
  title: "Website Templates — Customizable HTML Templates | Nepdora",
  description:
    "Explore our curated collection of professional HTML website templates. Fully customizable, responsive, and designed to help you launch your website in minutes with Nepdora.",
  keywords: [
    "website templates",
    "HTML templates",
    "responsive website design",
    "customizable templates",
    "Nepdora templates",
    "portfolio templates",
    "business templates",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/website-templates",
  },
  openGraph: {
    title: "Website Templates — Customizable HTML Templates | Nepdora",
    description:
      "Modern, responsive, and fully customizable website templates for every industry. Start building with Nepdora today.",
    url: "https://www.nepdora.com/website-templates",
    images: [
      {
        url: "/nepdora-templates-og.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora Website Templates",
      },
    ],
  },
};

import { JsonLd } from "@/components/shared/json-ld";

export default function WebsiteTemplatesPage() {
  const templateSchema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    name: "Nepdora Website Templates",
    description:
      "A collection of high-quality, customizable website templates for every industry.",
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
