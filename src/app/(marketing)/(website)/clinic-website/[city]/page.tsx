import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Clinic Website in ${cityName} | Nepdora`;
  const description = `Launch a professional clinic website in ${cityName} with Nepdora. Manage patient appointments, display services, and grow your practice online.`;

  const url = `https://www.nepdora.com/clinic-website/` + city.toLowerCase();

  return {
    title,
    description,
    keywords: [
      `clinic website in ${city}`,
      `healthcare web design ${city}`,
      `Nepdora clinic`,
      "medical website Nepal",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Nepdora",
      images: [
        {
          url: "/nepdora-image.jpg",
          width: 1200,
          height: 630,
          alt: `Best Clinic Website in ${cityName}`,
        },
      ],
      locale: "en_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/nepdora-image.jpg"],
    },
  };
}

import { JsonLd } from "@/components/shared/json-ld";

export async function generateStaticParams() {
  return NEPAL_CITIES.map(city => ({
    city: city.toLowerCase(),
  }));
}

export default async function Page({ params }: Props) {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Clinic Website in ${cityName}`,
    description: `Professional healthcare website solutions in ${cityName} powered by Nepdora.`,
    provider: {
      "@type": "Organization",
      name: "Nepdora",
      url: "https://www.nepdora.com",
    },
    areaServed: {
      "@type": "City",
      name: cityName,
      addressCountry: "NP",
    },
  };

  return (
    <>
      <JsonLd id="clinic-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="clinic-website" city={city} />
    </>
  );
}
