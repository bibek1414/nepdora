import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Agency Website in Nepal | Nepdora",
  description: "Build a professional agency website in Nepal with Nepdora. Attract more clients with SEO-optimized, fast-loading, and mobile-friendly designs.",
  keywords: [
    "agency website Nepal",
    "web agency Nepal",
    "Nepdora agency",
    "digital marketing Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/agency-website",
  },
};

export default function Page() {
  return <CitiesLandingPage category="agency-website" city="nepal" />;
}
