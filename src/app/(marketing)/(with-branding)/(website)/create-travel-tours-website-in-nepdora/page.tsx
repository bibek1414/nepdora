import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Create Travel & Tour Website in Nepdora | Official Platform",
  description:
    "Launch your stunning travel & tour website in Nepdora. Integrated bookings, local payments, and easy-to-use tools for Nepali tourism businesses.",
  path: "/create-travel-tours-website-in-nepdora",
  keywords: [
    "travel agency website Nepal",
    "tour package website nepal",
    "Nepdora travel",
    "tourism business digital nepal",
  ],
});

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Travel & Tour Website Builder",
  description:
    "Integrated web solutions for travel agencies and tour operators in Nepdora, featuring itinerary builders and booking systems.",
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
      <JsonLd id="travel-agency-schema" data={schema} />
      <CitiesLandingPage category="travel-tours" city="Nepdora" />
    </>
  );
}
