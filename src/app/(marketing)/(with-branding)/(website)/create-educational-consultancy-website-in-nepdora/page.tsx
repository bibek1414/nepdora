import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Create Educational Consultancy Website in Nepdora | Official Platform",
  description:
    "Build trust with students and parents in Nepdora. Launch your high-converting consultancy website with integrated lead generation and school discovery tools.",
  path: "/create-educational-consultancy-website-in-nepdora",
  keywords: [
    "education consultancy website Nepal",
    "study abroad website nepal",
    "Nepdora education",
    "consultancy lead generation nepal",
  ],
});

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Educational Consultancy Website Builder",
  description:
    "Professional website solutions for study abroad and educational consultancies in Nepdora, featuring student portal and inquiry management.",
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
      <JsonLd id="educational-consultancy-schema" data={schema} />
      <CitiesLandingPage category="educational-consultancy" city="Nepdora" />
    </>
  );
}
