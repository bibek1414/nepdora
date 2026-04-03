import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

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
    canonical: absoluteUrl("/restaurant-website"),
  },
  openGraph: {
    title: "Build a Restaurant Website in Nepal (Fast & Affordable) | Nepdora",
    description:
      "Get your cafe, bakery, or restaurant online in minutes. Nepdora is the easiest and most affordable way to build a professional restaurant website in Nepal, complete with digital menus and table reservations.",
    url: absoluteUrl("/restaurant-website"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
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
    name: SITE_NAME,
    url: absoluteUrl(),
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
