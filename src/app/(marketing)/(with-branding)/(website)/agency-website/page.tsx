import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Build a Professional Agency Website in Nepal (Fast & Cheap) | Nepdora",
  description:
    "Launch your digital agency, consultancy, or creative portfolio in Nepal in under 10 minutes. Build a fast, professional agency website with built-in lead generation and CRM.",
  keywords: [
    "agency website Nepal",
    "web agency Nepal",
    "Nepdora agency",
    "digital marketing Nepal",
    "portfolio builder Nepal",
  ],
  alternates: {
    canonical: absoluteUrl("/agency-website"),
  },
  openGraph: {
    title: "Build a Professional Agency Website in Nepal (Fast & Cheap) | Nepdora",
    description:
      "Launch your digital agency, consultancy, or creative portfolio in Nepal in under 10 minutes. Build a fast, professional agency website with built-in lead generation and CRM.",
    url: absoluteUrl("/agency-website"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora - Agency Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build a Professional Agency Website in Nepal (Fast & Cheap) | Nepdora",
    description:
      "Launch your digital agency, consultancy, or creative portfolio in Nepal in under 10 minutes. Build your agency website with Nepdora.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
      <CitiesLandingPage category="agency" city="nepal" />
    </>
  );
}
