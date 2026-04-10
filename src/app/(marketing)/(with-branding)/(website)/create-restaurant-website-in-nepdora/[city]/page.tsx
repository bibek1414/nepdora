import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { MAJOR_CITIES, cities } from "@/lib/seo-data";
import { JsonLd } from "@/components/shared/json-ld";

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
  const title = `Best Restaurant Website in ${cityName} | ${SITE_NAME}`;
  const description = `Create a stunning restaurant website in ${cityName} with ${SITE_NAME}. Showcase your menu, accept online orders, and manage table bookings with ease.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/restaurant-website/${city.toLowerCase()}`,
    keywords: [
      `restaurant website in ${city}`,
      `food ordering ${city}`,
      `${SITE_NAME} restaurant`,
      "menu template Nepal",
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
    name: `Restaurant Website in ${cityName}`,
    description: `Professional restaurant website and online ordering solutions in ${cityName} powered by ${SITE_NAME}.`,
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
      <JsonLd id="restaurant-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="restaurant-website" city={city} />
    </>
  );
}
