import FAQSection from "@/components/marketing/faq-section/faq-section";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Nepdora — Website Builder Nepal",
  description:
    "Have questions about building your website in Nepal? Find answers about pricing, e-commerce, hosting, and how to get started with Nepdora.",
  keywords: [
    "FAQ",
    "Nepdora questions",
    "website builder Nepal help",
    "ecommerce Nepal support",
  ],
  alternates: {
    canonical: absoluteUrl("/faq"),
  },
  openGraph: {
    title: "Frequently Asked Questions | Nepdora",
    description:
      "Have questions about building your website in Nepal? Find answers about pricing, e-commerce, hosting, and how to get started with Nepdora.",
    url: absoluteUrl("/faq"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora FAQ - Your questions answered",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Nepdora",
    description:
      "Have questions about building your website in Nepal? Find answers about pricing, e-commerce, hosting, and how to get started with Nepdora.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How quickly can I build my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "With our AI-powered platform, you can have a fully functional website ready in as little as 5 minutes. Choose a template, customize it with your content, and launch!",
      },
    },
    {
      "@type": "Question",
      name: "Do I need coding skills to use Nepdora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all! Our drag-and-drop builder is designed for everyone. No coding knowledge required. Everything is visual and intuitive.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my own domain name?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can connect your existing domain or register a new one directly through our platform. We also provide free SSL certificates.",
      },
    },
    {
      "@type": "Question",
      name: "Does Nepdora support local payment gateways like eSewa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Nepdora supports popular local payment gateways in Nepal, including eSewa, Khalti, and IME Pay, making it easy for you to accept payments from your customers.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <JsonLd id="faq-schema" data={faqSchema} />
      <FAQSection />
    </>
  );
}
