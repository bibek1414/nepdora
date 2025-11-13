import SupportHeader from "@/components/site-owners/admin/support/support-header";
import SupportFAQ from "@/components/site-owners/admin/support/support-faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Support | Help Center & FAQs",
  description:
    "Get help with Nepdora. Visit our Support Center to find answers to common questions, explore FAQs, and contact our team for personalized assistance.",
  alternates: {
    canonical: "https://www.nepdora.com/support",
  },
  keywords: [
    "Nepdora support",
    "help center",
    "website FAQ",
    "ecommerce help",
    "customer support Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Nepdora Support | Help Center & FAQs",
    description:
      "Find answers to common questions and get personalized assistance from the Nepdora team.",
    url: "https://www.nepdora.com/support",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora Help Center and FAQ",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora Support | Help Center & FAQs",
    description:
      "Get help with Nepdora. Visit our Support Center to find answers to common questions, explore FAQs, and contact our team for personalized assistance.",
    images: ["https://www.nepdora.com/nepdora-image.jpg"],
  },
};

export default function SupportPage() {
  return (
    <>
      <SupportHeader />
      <SupportFAQ />
    </>
  );
}
