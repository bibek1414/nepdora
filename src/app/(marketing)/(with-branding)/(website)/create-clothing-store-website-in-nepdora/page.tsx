import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Create Clothing Store Website in Nepdora | Official Platform",
  description:
    "Launch your professional fashion boutique or clothing store in Nepdora. Integrated payments, local support, and easy-to-use tools from Nepdora.",
  path: "/create-clothing-store-website-in-nepdora",
  keywords: [
    "clothing store website Nepal",
    "fashion boutique Nepal",
    "sell clothes online Nepal",
    "Nepdora clothing shop",
  ],
});

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Clothing Store Website Builder",
  description:
    "Integrated web solutions for fashion boutiques and clothing stores in Nepdora, featuring inventory management and local payment integration.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  areaServed: "NP",
};

export default function Page() {
  return (
    <>
      <JsonLd id="clothing-store-schema" data={schema} />
      <CitiesLandingPage category="clothing-store" city="Nepdora" />
    </>
  );
}
