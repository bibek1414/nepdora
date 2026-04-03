import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (!cities.includes(city.toLowerCase())) {
    notFound();
  }
  const isKathmandu = city.toLowerCase() === "kathmandu";
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = isKathmandu
    ? `Create Free E-Commerce Website in Kathmandu (2026)`
    : `Best Ecommerce Website in ${cityName} | Nepdora`;
  const description = isKathmandu
    ? `Build your E-Commerce website in Kathmandu for free with Nepdora. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.`
    : `Create your professional ecommerce website in ${cityName} with Nepdora. AI-powered, mobile-responsive, and integrated with local payments like eSewa.`;
  const url = `https://www.nepdora.com/ecommerce/` + city.toLowerCase();

  return {
    title,
    description,
    keywords: [
      `ecommerce website in ${city}`,
      `web design ${city}`,
      `Nepdora ${city}`,
      "online store Nepal",
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
          alt: `Best Ecommerce Website in ${cityName}`,
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
    name: `Ecommerce Website in ${cityName}`,
    description: `Professional ecommerce website solutions in ${cityName} powered by Nepdora.`,
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
      <JsonLd id="ecommerce-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="ecommerce" city={city} />
    </>
  );
}
