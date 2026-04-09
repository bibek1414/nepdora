import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Create Agency Website in Nepdora | Official Platform",
  description:
    "Launch your digital agency, consultancy, or creative portfolio in Nepdora. Build a fast, professional agency website with built-in lead generation and CRM.",
  path: "/create-agency-website-in-nepdora",
  keywords: [
    "agency website Nepal",
    "web agency Nepal",
    "Nepdora agency",
    "digital marketing Nepal",
    "portfolio builder Nepal",
  ],
});

const agencySchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Agency Website Builder",
  description:
    "A platform for digital and creative agencies in Nepal to showcase their portfolio and manage clients with a professional website.",
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
      <JsonLd id="agency-schema" data={agencySchema} />
      <CitiesLandingPage category="agency" city="Nepdora" />
    </>
  );
}
