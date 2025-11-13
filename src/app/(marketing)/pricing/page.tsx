import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Pricing: Start Free, Upgrade for More Features",
  description:
    "Start for FREE! Compare Nepdora's transparent pricing plans for website development, e-commerce, and social media tools. Only pay as you grow.",
  alternates: {
    canonical: "https://www.nepdora.com/pricing",
  },
  keywords: [
    "Nepdora pricing",
    "website cost Nepal",
    "ecommerce pricing",
    "free website builder",
    "affordable web design",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Nepdora Pricing: Start Free, Upgrade for More Features",
    description:
      "Start for FREE! Compare Nepdora's transparent pricing plans for website development, e-commerce, and social media tools. Only pay as you grow.",
    url: "https://www.nepdora.com/pricing",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/og-image-all.png",
        width: 1200,
        height: 630,
        alt: "Nepdora's transparent and flexible pricing plans",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora Pricing: Start Free, Upgrade for More Features",
    description:
      "Start for FREE! Compare Nepdora's transparent pricing plans and only pay as you grow.",
    images: ["https://www.nepdora.com/og-image-all.png"],
  },
};

export default function PricingPage() {
  return <PricingSection />;
}
