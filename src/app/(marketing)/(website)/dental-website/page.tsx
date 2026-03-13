import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Dental Website in Nepal | Nepdora",
  description: "Professional dental clinic website builder in Nepal. Get more patients with a stunning, SEO-optimized website for your dental practice.",
  keywords: [
    "dental website Nepal",
    "dentist website Nepal",
    "Nepdora dental",
    "dental clinic digital Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/dental-website",
  },
};

export default function Page() {
  return <CitiesLandingPage category="dental-website" city="nepal" />;
}
