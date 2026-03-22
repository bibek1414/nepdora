import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Medical & Clinic Website Builder in Nepal | Nepdora",
  description:
    "Build a professional presence for your clinic. Patient appointments, service listings, and health blog features. The best website builder for doctors in Nepal.",
  keywords: [
    "clinic website Nepal",
    "hospital website Nepal",
    "Nepdora clinic",
    "healthcare digital Nepal",
    "doctor website Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/clinic-website",
  },
  openGraph: {
    title: "Medical & Clinic Website Builder in Nepal | Nepdora",
    description:
      "Build a professional presence for your clinic. Patient appointments, service listings, and health blog features.",
    url: "https://www.nepdora.com/clinic-website",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Clinic Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical & Clinic Website Builder in Nepal | Nepdora",
    description:
      "Patient appointments, service listings, and health blog features. Build your clinic website with Nepdora.",
    images: ["/nepdora-image.jpg"],
  },
};

const clinicSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Clinic Website Builder",
  description:
    "Specially designed website solutions for medical clinics and healthcare providers in Nepal with appointment features.",
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
      <JsonLd id="clinic-schema" data={clinicSchema} />
      <CitiesLandingPage category="clinic" city="nepal" />
    </>
  );
}
