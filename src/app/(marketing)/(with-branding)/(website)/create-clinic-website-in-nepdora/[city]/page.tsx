import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ city: string }>;
}

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (!cities.includes(city.toLowerCase())) {
    notFound();
  }
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Clinic Website in ${cityName} | Nepdora`;
  const description = `Launch a professional clinic website in ${cityName} with Nepdora. Manage patient appointments, display services, and grow your practice online.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/clinic-website/${city.toLowerCase()}`,
    keywords: [
      `clinic website in ${city}`,
      `healthcare web design ${city}`,
      `Nepdora clinic`,
      "medical website Nepal",
    ],
  });
}

import { MAJOR_CITIES, cities } from "@/lib/seo-data";
import { JsonLd } from "@/components/shared/json-ld";

export async function generateStaticParams() {
  return MAJOR_CITIES.map(city => ({
    city: city.toLowerCase(),
  }));
}

export default async function Page({ params }: Props) {
  const { city } = await params;
  if (!cities.includes(city.toLowerCase())) {
    notFound();
  }
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Clinic Website in ${cityName}`,
    description: `Professional healthcare website solutions in ${cityName} powered by Nepdora.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
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
