import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Build a Restaurant Website in Nepal (Fast & Affordable) | Nepdora",
  description:
    "Get your cafe, bakery, or restaurant online in minutes. Nepdora is the easiest and most affordable way to build a professional restaurant website in Nepal, complete with digital menus and table reservations.",
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
    title: "Build a Restaurant Website in Nepal (Fast & Affordable) | Nepdora",
    description:
      "Get your cafe, bakery, or restaurant online in minutes. Nepdora is the easiest and most affordable way to build a professional restaurant website in Nepal, complete with digital menus and table reservations.",
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
    title: "Build a Restaurant Website in Nepal (Fast & Affordable) | Nepdora",
    description:
      "Get your cafe, bakery, or restaurant online in minutes. Nepdora is the easiest and most affordable way to build a professional restaurant website in Nepal, complete with digital menus and table reservations.",
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
