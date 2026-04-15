import FAQSection from "@/components/marketing/faq-section/faq-section";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora FAQ | Website Builder Questions & Support in Nepal",
  description:
    "Find answers to common questions about Nepdora. Learn about website building, pricing, ecommerce, hosting, and how to get started in Nepal.",
  path: "/faq",
  keywords: [
    "Nepdora FAQ",
    "website builder Nepal FAQ",
    "Nepdora help",
    "ecommerce website Nepal questions",
    "website builder support Nepal",
    "how to build website Nepal",
  ],
});

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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl(),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "FAQ",
      item: absoluteUrl("/faq"),
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <JsonLd id="faq-schema" data={faqSchema} />
      <JsonLd id="faq-breadcrumb" data={breadcrumbSchema} />
      <div className="container mx-auto max-w-6xl px-6 pt-4">
        <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />
      </div>
      <FAQSection />
    </>
  );
}
