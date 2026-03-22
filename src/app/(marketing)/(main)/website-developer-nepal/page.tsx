import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/marketing/website-developer-nepal/Hero";
import EmpathySection from "@/components/marketing/website-developer-nepal/EmpathySection";
import ComparisonTable from "@/components/marketing/website-developer-nepal/ComparisonTable";
import HowItWorks from "@/components/marketing/website-developer-nepal/HowItWorks";
import WhoItsBuiltFor from "@/components/marketing/website-developer-nepal/WhoItsBuiltFor";
import FAQSection from "@/components/marketing/website-developer-nepal/FAQSection";
import CTASection from "@/components/marketing/website-developer-nepal/CTASection";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title:
    "Website Developer in Nepal? Build It Yourself with Nepdora — No Coding Needed",
  description:
    "Looking for a website developer in Nepal? Skip the wait and high cost. Nepdora lets any Nepali business build a professional website in minutes — drag, drop, done. Try free.",
  keywords: [
    "website developer Nepal",
    "web development company Nepal",
    "website builder Nepal",
    "Nepdora",
    "create website Nepal",
    "e-commerce Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/website-developer-nepal",
  },
  openGraph: {
    title: "Website Developer in Nepal? Build It Yourself with Nepdora",
    description:
      "Looking for a website developer in Nepal? Skip the wait and high cost. Build a professional website in minutes with Nepdora. Try free.",
    url: "https://www.nepdora.com/website-developer-nepal",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Build your website in Nepal with Nepdora",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Developer in Nepal? Build It Yourself with Nepdora",
    description:
      "Skip the wait and high cost. Build a professional website in minutes with Nepdora. Try free.",
    images: ["/nepdora-image.jpg"],
  },
};

export default function WebsiteDeveloperNepalPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a website developer cost in Nepal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average website developer in Nepal charges between Rs. 30,000 to Rs. 2,00,000+ depending on complexity. With Nepdora, you can start from as low as Rs. 999/month with no upfront development cost.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to build a website in Nepal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Traditional development takes 4–12 weeks in Nepal. With Nepdora's AI-powered builder, you can launch your professional website in just 30 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build my own website without a developer in Nepal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Nepdora is specifically designed for Nepali business owners to build their own professional websites using a simple drag-and-drop interface, requiring zero coding skills.",
        },
      },
      {
        "@type": "Question",
        name: "Is Nepdora better than hiring a developer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepdora is a faster, more affordable, and more flexible alternative. You get full control over your content, built-in payments (eSewa/Khalti), and 24/7 support without the high upfront costs or long wait times of hiring a developer.",
        },
      },
      {
        "@type": "Question",
        name: "Does Nepdora support eSewa and Khalti payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Nepdora has built-in integration for popular Nepali payment gateways including eSewa and Khalti, making it easy to accept local payments.",
        },
      },
    ],
  };

  return (
    <div className="bg-white">
      <JsonLd id="faq-schema" data={faqSchema} />

      <Hero />
      <EmpathySection />
      <ComparisonTable />
      <HowItWorks />
      <WhoItsBuiltFor />
      <FAQSection />
      <CTASection />
     
    </div>
  );
}
