import { SEOLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Agency Website in ${cityName} | Nepdora`;
  const description = `Build a professional agency website in ${cityName} with Nepdora. Attract more clients with SEO-optimized, fast-loading, and mobile-friendly designs.`;

  return {
    title,
    description,
    keywords: [
      `agency website in ${city}`,
      `web agency ${city}`,
      `Nepdora agency`,
      "digital marketing Nepal",
    ],
    alternates: {
      canonical: `https://www.nepdora.com/agency-website/` + city.toLowerCase(),
    },
  };
}

export async function generateStaticParams() {
  return NEPAL_CITIES.map(city => ({
    city: city.toLowerCase(),
  }));
}

export default async function Page({ params }: Props) {
  const { city } = await params;
  return <SEOLandingPage category="agency-website" city={city} />;
}
