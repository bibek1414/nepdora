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
  const isKathmandu = city.toLowerCase() === "kathmandu";
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = isKathmandu
    ? `Create Free E-Commerce Website in Kathmandu (2026)`
    : `Best Ecommerce Website in ${cityName} | ${SITE_NAME}`;
  const description = isKathmandu
    ? `Build your E-Commerce website in Kathmandu for free with ${SITE_NAME}. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.`
    : `Create your professional ecommerce website in ${cityName} with ${SITE_NAME}. AI-powered, mobile-responsive, and integrated with local payments like eSewa.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/ecommerce/${city.toLowerCase()}`,
    keywords: [
      `ecommerce website in ${city}`,
      `web design ${city}`,
      `${SITE_NAME} ${city}`,
      "online store Nepal",
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
    name: `Ecommerce Website in ${cityName}`,
    description: `Professional ecommerce website solutions in ${cityName} powered by ${SITE_NAME}.`,
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
      <JsonLd id="ecommerce-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="ecommerce" city={city} />
    </>
  );
}
