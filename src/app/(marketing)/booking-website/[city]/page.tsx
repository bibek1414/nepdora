import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = `Best Booking Website in ${cityName} | Nepdora`;
  const description = `Set up your professional booking system in ${cityName} with Nepdora. Manage appointments, reservations, and schedules easily with our AI-powered platform.`;

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
      canonical:
        `https://www.nepdora.com/booking-website/` + city.toLowerCase(),
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
  return <CitiesLandingPage category="booking-website" city={city} />;
}
