import CountdownAnimation from "@/components/marketing/about-us/hero-section";
import AboutUs from "@/components/marketing/about-us/about-us";
import OurStrengths from "@/components/marketing/about-us/our-strengths";
import CustomerTestimonials from "@/components/marketing/testimonials/testimonials";
import Technology from "@/components/marketing/about-us/techonology-section";
import type { Metadata } from "next";

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
    <>
      <CountdownAnimation />
      <AboutUs />
      <OurStrengths />
      <CustomerTestimonials />
      <Technology />
    </>
  );
}
