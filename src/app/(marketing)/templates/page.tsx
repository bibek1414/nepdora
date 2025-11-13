import TemplatesPage from "@/components/marketing/templates/templates-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora : Professional Website Templates for Any Business in Nepal",
  description:
    "Browse hundreds of professionally designed website templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
  alternates: {
    canonical: "https://www.nepdora.com/templates",
  },
  keywords: [
    "website templates Nepal",
    "ecommerce templates",
    "restaurant website design",
    "agency website templates",
    "customizable website designs",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Nepdora : Professional Website Templates for Any Business in Nepal",
    description:
      "Browse hundreds of professionally designed website templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
    url: "https://www.nepdora.com/templates",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/og-image-all.png",
        width: 1200,
        height: 630,
        alt: "Professionally designed website templates from Nepdora",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora : Professional Website Templates for Any Business in Nepal",
    description:
      "Browse free templates for E-commerce, Restaurants, Agencies, and more. Customize any design with our easy builder.",
    images: ["https://www.nepdora.com/og-image-all.png"],
  },
};

export default function Templates() {
  return <TemplatesPage />;
}
