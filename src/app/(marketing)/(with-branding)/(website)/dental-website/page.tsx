import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Build a Dental Practice Website in Nepal (Fast Setup) | Nepdora",
  description:
    "Launch your professional dental website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from Nepdora.",
  path: "/dental-website",
  keywords: [
    "dental website Nepal",
    "dentist website Nepal",
    "Nepdora dental",
    "dental clinic digital Nepal",
  ],
});

const dentalSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Dental Clinic Website Builder",
  description:
    "Dental clinic website builder with specialized features like appointment scheduling and patient education for Nepali dental practices.",
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
      <JsonLd id="dental-schema" data={dentalSchema} />
      <CitiesLandingPage category="dental" city="nepal" />
    </>
  );
}
