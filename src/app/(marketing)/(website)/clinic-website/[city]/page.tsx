import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Clinic Website in ${cityName} | Nepdora`;
  const description = `Launch a professional clinic website in ${cityName} with Nepdora. Manage patient appointments, display services, and grow your practice online.`;

  return {
    title,
    description,
    keywords: [
      `clinic website in ${city}`,
      `healthcare web design ${city}`,
      `Nepdora clinic`,
      "medical website Nepal",
    ],
    alternates: {
      canonical: `https://www.nepdora.com/clinic-website/` + city.toLowerCase(),
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
  return <CitiesLandingPage category="clinic-website" city={city} />;
}
