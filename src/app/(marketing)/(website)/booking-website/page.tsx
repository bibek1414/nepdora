import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Booking Website in Nepal | Nepdora",
  description:
    "Build a powerful booking system for your business in Nepal. Online appointments, scheduling, and payment integration with Nepdora.",
  keywords: [
    "booking website Nepal",
    "appointment system Nepal",
    "Nepdora booking",
    "scheduling software Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/booking-website",
  },
};

export default function Page() {
  return <CitiesLandingPage category="booking-website" city="nepal" />;
}
