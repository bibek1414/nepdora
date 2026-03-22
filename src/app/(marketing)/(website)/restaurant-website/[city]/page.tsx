import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Restaurant Website in ${cityName} | Nepdora`;
  const description = `Create a stunning restaurant website in ${cityName} with Nepdora. Showcase your menu, accept online orders, and manage table bookings with ease.`;

  const url = `https://www.nepdora.com/restaurant-website/` + city.toLowerCase();

  return {
    title,
    description,
    keywords: [
      `restaurant website in ${city}`,
      `food ordering ${city}`,
      `Nepdora restaurant`,
      "menu template Nepal",
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
          alt: `Best Restaurant Website in ${cityName}`,
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

import { MAJOR_CITIES } from "@/lib/seo-data";
import { JsonLd } from "@/components/shared/json-ld";

export async function generateStaticParams() {
  return MAJOR_CITIES.map(city => ({
    city: city.toLowerCase(),
  }));
}

export default async function Page({ params }: Props) {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Restaurant Website in ${cityName}`,
    description: `Professional restaurant website and online ordering solutions in ${cityName} powered by Nepdora.`,
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
      <JsonLd id="restaurant-city-schema" data={serviceSchema} />
      <CitiesLandingPage category="restaurant-website" city={city} />
    </>
  );
}
