import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Dental Practice Website Builder in Nepal | Nepdora",
  description:
    "Grow your dental clinic with a specialized website. Appointment scheduling and patient education tools. Professional designs for dentists in Nepal.",
  keywords: [
    "dental website Nepal",
    "dentist website Nepal",
    "Nepdora dental",
    "dental clinic digital Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/dental-website",
  },
  openGraph: {
    title: "Dental Practice Website Builder in Nepal | Nepdora",
    description:
      "Grow your dental clinic with a specialized website. Appointment scheduling and patient education tools.",
    url: "https://www.nepdora.com/dental-website",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Dental Practice Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dental Practice Website Builder in Nepal | Nepdora",
    description:
      "Appointment scheduling and patient education tools for dentists. Build your dental clinic website with Nepdora.",
    images: ["/nepdora-image.jpg"],
  },
};

const dentalSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Dental Clinic Website Builder",
  description:
    "Dental clinic website builder with specialized features like appointment scheduling and patient education for Nepali dental practices.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: "https://www.nepdora.com",
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
