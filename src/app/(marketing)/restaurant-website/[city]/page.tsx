import { SEOLandingPage } from "@/components/marketing/cities/cities-landing-page";
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
      canonical:
        `https://www.nepdora.com/restaurant-website/` + city.toLowerCase(),
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
  return <SEOLandingPage category="restaurant-website" city={city} />;
}
