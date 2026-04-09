import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Create Medical Clinic Website in Nepdora | Official Platform",
  description:
    "Launch your professional medical clinic website in Nepdora. Integrated payments, local support, and easy-to-use tools from Nepdora.",
  path: "/create-medical-clinic-website-in-nepdora",
  keywords: [
    "clinic website Nepal",
    "hospital website Nepal",
    "Nepdora clinic",
    "healthcare digital Nepal",
    "doctor website Nepal",
  ],
});

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Clinic Website Builder",
  description:
    "Specially designed website solutions for medical clinics and healthcare providers in Nepdora with appointment features.",
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
      <JsonLd id="clinic-schema" data={schema} />
      <CitiesLandingPage category="clinic" city="Nepdora" />
    </>
  );
}
