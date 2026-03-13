import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Clinic Website in Nepal | Nepdora",
  description: "Create a professional website for your clinic or hospital in Nepal. Manage patients, appointments, and medical records online with Nepdora.",
  keywords: [
    "clinic website Nepal",
    "hospital website Nepal",
    "Nepdora clinic",
    "healthcare digital Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/clinic-website",
  },
};

export default function Page() {
  return <CitiesLandingPage category="clinic-website" city="nepal" />;
}
