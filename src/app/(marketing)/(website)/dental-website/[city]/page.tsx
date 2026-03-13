import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Dental Website in ${cityName} | Nepdora`;
  const description = `Professional dental website in ${cityName} with Nepdora. Appointment scheduling, service showcases, and patient management for your dental clinic.`;

  return {
    title,
    description,
    keywords: [
      `dental website in ${city}`,
      `dentist web design ${city}`,
      `Nepdora dental`,
      "dental clinic Nepal",
    ],
    alternates: {
      canonical: `https://www.nepdora.com/dental-website/` + city.toLowerCase(),
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
  return <CitiesLandingPage category="dental-website" city={city} />;
}
