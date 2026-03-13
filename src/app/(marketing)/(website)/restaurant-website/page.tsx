import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Restaurant Website in Nepal | Nepdora",
  description: "Grow your restaurant business in Nepal. Online ordering, menu management, and table reservations with your own branded website from Nepdora.",
  keywords: [
    "restaurant website Nepal",
    "food ordering system Nepal",
    "Nepdora restaurant",
    "digital menu Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/restaurant-website",
  },
};

export default function Page() {
  return <CitiesLandingPage category="restaurant-website" city="nepal" />;
}
