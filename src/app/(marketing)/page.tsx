import Script from "next/script";
import dynamic from "next/dynamic";
import HeroSection from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import ProcessSection from "@/components/marketing/process-section/process-section";
import PricingSection from "@/components/marketing/pricing-section/pricing-section-hero";
import BuildYourWay from "@/components/marketing/build-your-way/build-your-way";
import StatsSection from "@/components/marketing/stats-section/stats-section";
import AISection from "@/components/marketing/ai-section/ai-section";
import type { Metadata } from "next";
import { HeroScrollDemo } from "@/components/marketing/hero-scroll/hero-scroll";
import BuildGrowShowcase from "@/components/marketing/build-grow-showcase/build-grow-showcase";
// Lazy load non-critical components to reduce initial load
const TestimonialsSection = dynamic(
  () => import("@/components/marketing/testimonials/testimonials"),
  { loading: () => <div className="py-20" /> }
);
const FAQSection = dynamic(
  () => import("@/components/marketing/faq-section/faq-section"),
  { loading: () => <div className="py-20" /> }
);
const ContactSection = dynamic(
  () => import("@/components/marketing/contact-us/contact-us"),
  { loading: () => <div className="py-16" /> }
);
const TemplatesPage = dynamic(
  () => import("@/components/marketing/templates/templates-page"),
  { loading: () => <div className="py-20" /> }
);

export const metadata: Metadata = {
  title: "Nepdora — Your Complete Website Builder in Minutes",
  description:
    "Launch your business online in just 5 minutes with Nepdora's free website builder. Get free hosting, AI-powered templates, e-commerce tools, CRM system, and 24/7 customer support. Perfect for businesses, portfolios, and online stores in Nepal. Start building your dream website today with zero coding required!",
  keywords: [
    "website builder Nepal",
    "create website Nepal",
    "ecommerce Nepal",
    "portfolio website Nepal",
    "Nepdora",
    "Made in Nepal",
    "free website builder",
    "AI website builder",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  alternates: {
    canonical: "https://www.nepdora.com",
  },
  openGraph: {
    title: "Nepdora — Your Complete Website Builder in Nepal",
    description:
      "Launch your business online in just 5 minutes with Nepdora's free website builder. Get free hosting, AI-powered templates, e-commerce tools, and 24/7 support. Start building today!",
    url: "https://www.nepdora.com",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Your Complete Website Builder in Nepal",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora — Your Complete Website Builder in Nepal",
    description:
      "Launch your business online in just 5 minutes with Nepdora's free website builder. Get free hosting, AI-powered templates, e-commerce tools, and 24/7 support. Start building today!",
    images: ["/nepdora-image.jpg"],
  },
};

export default function Marketing() {
  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    name: "Nepdora",
    url: "https://nepdora.com",
    description:
      "Nepdora — Your complete platform for creating modern websites, businesses, and portfolios in Nepal.",
    image: "https://nepdora.com/nepdora-image.jpg",
    sameAs: [
      "https://www.facebook.com/NepdoraWebBuilder",
      "https://www.instagram.com/nep_dora",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nepdora.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977 986-6316114",
      contactType: "customer support",
      contactOption: "TollFree",
      areaServed: "NP",
      availableLanguage: ["Nepali", "English"],
    },
    openingHours: "Mo-Su 09:00-18:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kathmandu, Nepal",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      addressCountry: "NP",
    },
  };

  const corporationSchema = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: "Nepdora Pvt. Ltd.",
    alternateName: "Nepdora",
    url: "https://nepdora.com",
    logo: "https://nepdora.com/fulllogo.svg",
    founder: {
      "@type": "Person",
      name: "Vishal Dhakal",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977 986-6316114",
      contactType: "customer support",
    },
  };

  // Add FAQ Schema
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
    ],
  };

  return (
    <>
      {/* SEO JSON-LD Structured Data - Load after interactive for better performance */}
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-corporation"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(corporationSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Marketing Page Sections */}
      <div>
        <HeroSection />
        <HeroScrollDemo />
        {/* <StatsSection /> */}
        <FeaturesSection />
        <ProcessSection />
        <BuildYourWay />
        <AISection />
        <TemplatesPage />
        <TestimonialsSection />
        <PricingSection />
        <ContactSection />
        <FAQSection />
        <BuildGrowShowcase />
      </div>
    </>
  );
}
