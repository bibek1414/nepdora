import { SEOLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Ecommerce Website in ${cityName} | Nepdora`;
  const description = `Create your professional ecommerce website in ${cityName} with Nepdora. AI-powered, mobile-responsive, and integrated with local payments like eSewa.`;

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
      canonical:
        `https://www.nepdora.com/ecommerce-website/` + city.toLowerCase(),
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
  return <SEOLandingPage category="ecommerce-website" city={city} />;
}
