import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Build a Clinic Website in Nepal (Fast Setup) | ${SITE_NAME}`,
  description: `Launch your professional clinic website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from ${SITE_NAME}.`,
  keywords: [
    "clinic website Nepal",
    "hospital website Nepal",
    `${SITE_NAME} clinic`,
    "healthcare digital Nepal",
    "doctor website Nepal",
  ],
  metadataBase: new URL(absoluteUrl()),
  alternates: {
    canonical: absoluteUrl("/clinic-website"),
  },
  openGraph: {
    title: `Build a Clinic Website in Nepal (Fast Setup) | ${SITE_NAME}`,
    description: `Launch your professional clinic website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from ${SITE_NAME}.`,
    url: absoluteUrl("/clinic-website"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Clinic Website Builder`,
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Build a Clinic Website in Nepal (Fast Setup) | ${SITE_NAME}`,
    description: `Launch your professional clinic website in Nepal in under 10 minutes. Build with ${SITE_NAME}.`,
    images: [DEFAULT_OG_IMAGE],
  },
};

const clinicSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${SITE_NAME} Clinic Website Builder`,
  description:
    "Specially designed website solutions for medical clinics and healthcare providers in Nepal with appointment features.",
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
      <JsonLd id="clinic-schema" data={clinicSchema} />
      <CitiesLandingPage category="clinic" city="nepal" />
    </>
  );
}
