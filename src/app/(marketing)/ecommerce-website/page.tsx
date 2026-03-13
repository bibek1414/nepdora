import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best eCommerce Website in Nepal | Nepdora",
  description: "Start your online store in Nepal today. Powerful eCommerce features, inventory management, and payment gateway integration with Nepdora.",
  keywords: [
    "ecommerce website Nepal",
    "online store Nepal",
    "Nepdora ecommerce",
    "sell online Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/ecommerce-website",
  },
};

export default function Page() {
  return <CitiesLandingPage category="ecommerce-website" city="nepal" />;
}
