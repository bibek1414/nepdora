import type { Metadata } from "next";
import AboutHero from "@/components/marketing/about-us/about-hero";
import AboutStory from "@/components/marketing/about-us/about-story";
import AboutSecurity from "@/components/marketing/about-us/about-security";
import AboutValues from "@/components/marketing/about-us/about-values";
import AboutTeam from "@/components/marketing/about-us/about-team";
import CTA from "@/components/marketing/cta-section/cta-section";
import Testimonials from "@/components/marketing/testimonials/testimonials";

export const metadata: Metadata = {
  title: "About Nepdora : Made in Nepal Website Builder",
  description:
    "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management. Build your complete digital presence here.",
  alternates: {
    canonical: "https://www.nepdora.com/about",
  },
  keywords: [
    "Nepdora about",
    "Nepal website builder",
    "ecommerce platform Nepal",
    "digital presence solution",
    "Made in Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "About Nepdora : Made in Nepal Website Builder",
    description:
      "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management. Build your complete digital presence here.",
    url: "https://www.nepdora.com/about",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Nepdora - Made in Nepal Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Nepdora : Made in Nepal Website Builder",
    description:
      "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management.",
    images: ["https://www.nepdora.com/nepdora-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <AboutHero />
      <AboutStory />
      <div className="space-y-24 pb-24 sm:space-y-32 sm:pb-32 lg:space-y-48 lg:pb-48">
        <AboutSecurity />
        <AboutValues />
        <AboutTeam />
        <Testimonials />
        <CTA />
      </div>
    </div>
  );
}
