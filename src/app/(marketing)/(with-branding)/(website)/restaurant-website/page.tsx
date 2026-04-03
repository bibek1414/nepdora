import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Best Restaurant Website & Ordering System in Nepal | Nepdora",
  description:
    "Grow your restaurant business in Nepal. Online ordering, menu management, and table reservations with your own branded website from Nepdora.",
  keywords: [
    "restaurant website Nepal",
    "food ordering system Nepal",
    "Nepdora restaurant",
    "digital menu Nepal",
    "online food delivery Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/restaurant-website",
  },
  openGraph: {
    title: "Best Restaurant Website & Ordering System in Nepal | Nepdora",
    description:
      "Grow your restaurant business in Nepal. Online ordering, menu management, and table reservations.",
    url: "https://www.nepdora.com/restaurant-website",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Restaurant Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Restaurant Website & Ordering System in Nepal | Nepdora",
    description:
      "Online ordering, menu management, and table reservations. Build your restaurant website with Nepdora.",
    images: ["/nepdora-image.jpg"],
  },
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Restaurant Website Builder",
  description:
    "Integrated web solutions for restaurants in Nepal, featuring online food ordering and table reservation systems.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: "https://www.nepdora.com",
  },
  areaServed: "NP",
};

export default function Page() {
  return (
    <>
      <JsonLd id="restaurant-schema" data={restaurantSchema} />
      <CitiesLandingPage category="restaurant" city="nepal" />
    </>
  );
}
