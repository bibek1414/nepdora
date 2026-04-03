import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (!cities.includes(city.toLowerCase())) {
    notFound();
  }
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Booking Website in ${cityName} | Nepdora`;
  const description = `Set up your professional booking system in ${cityName} with Nepdora. Manage appointments, reservations, and schedules easily with our AI-powered platform.`;

  const url = absoluteUrl(`/booking-website/` + city.toLowerCase());

  return {
    title,
    description,
    keywords: [
      `booking website in ${city}`,
      `reservation system ${city}`,
      `Nepdora booking`,
      "appointment software Nepal",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `Best Booking Website in ${cityName}`,
        },
      ],
      locale: "en_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
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
    name: `Booking Website in ${cityName}`,
    description: `Professional booking system solutions in ${cityName} powered by Nepdora.`,
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
      <JsonLd id="booking-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="booking-website" city={city} />
    </>
  );
}
