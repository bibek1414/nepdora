import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Create Grocery Website in Nepdora | Official Platform",
  description:
    "Bring your local grocery store online in Nepdora. Accept orders, manage inventory, and deliver daily essentials to your neighborhood with ease using Nepdora.",
  path: "/create-grocery-website-in-nepdora",
  keywords: [
    "grocery website Nepal",
    "online grocery store Nepal",
    "Nepdora grocery",
    "delivery app Nepal",
    "Kirana store online nepal",
  ],
});

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Grocery Website Builder",
  description:
    "E-commerce solutions for grocery stores and supermarkets in Nepdora, featuring inventory syncing and scheduled delivery management.",
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
      <JsonLd id="grocery-schema" data={schema} />
      <CitiesLandingPage category="grocery" city="Nepdora" />
    </>
  );
}
