import FeaturesSection from "@/components/marketing/features-section/features-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
  description:
    "See the comprehensive features that power your digital presence: web hosting, online store setup, analytics, and centralized social media management.",
  alternates: {
    canonical: "https://www.nepdora.com/features",
  },
  keywords: [
    "Nepdora features",
    "website builder features",
    "ecommerce tools",
    "social media management",
    "web hosting Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
    description:
      "See the comprehensive features that power your digital presence: web hosting, online store setup, analytics, and centralized social media management.",
    url: "https://www.nepdora.com/features",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.png",
        width: 1200,
        height: 630,
        alt: "Nepdora's powerful website and e-commerce features",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora Features: Website Builder, E-commerce & Social Tools",
    description:
      "Explore features like web hosting, online store setup, analytics, and centralized social media management.",
    images: ["https://www.nepdora.com/nepdora-image.png"],
  },
};

export default function FeaturesPage() {
  return <FeaturesSection />;
}
