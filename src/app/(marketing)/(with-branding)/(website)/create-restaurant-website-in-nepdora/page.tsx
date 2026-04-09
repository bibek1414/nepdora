import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Create Restaurant Website in Nepdora | Official Platform",
  description:
    "Get your cafe, bakery, or restaurant online in minutes with Nepdora. The easiest way to build a professional restaurant website in Nepdora with digital menus and table reservations.",
  path: "/create-restaurant-website-in-nepdora",
  keywords: [
    "restaurant website Nepal",
    "food ordering system Nepal",
    "Nepdora restaurant",
    "digital menu Nepal",
    "online food delivery Nepal",
  ],
});

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
      <CitiesLandingPage category="restaurant" city="Nepdora" />
    </>
  );
}
