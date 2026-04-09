import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { MAJOR_CITIES, cities } from "@/lib/seo-data";
import { JsonLd } from "@/components/shared/json-ld";

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
  const title = `Best Dental Website in ${cityName} | ${SITE_NAME}`;
  const description = `Professional dental website in ${cityName} with ${SITE_NAME}. Appointment scheduling, service showcases, and patient management for your dental clinic.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/dental-website/${city.toLowerCase()}`,
    keywords: [
      `dental website in ${city}`,
      `dentist web design ${city}`,
      `${SITE_NAME} dental`,
      "dental clinic Nepal",
    ],
  });
}

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
    name: `Dental Website in ${cityName}`,
    description: `Professional dental clinic website solutions in ${cityName} powered by ${SITE_NAME}.`,
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
      <JsonLd id="dental-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="dental-website" city={city} />
    </>
  );
}
