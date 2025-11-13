import Script from "next/script";
import HeroSection from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import ProcessSection from "@/components/marketing/process-section/process-section";
import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials/testimonials";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import BuildYourWay from "@/components/marketing/build-your-way/build-your-way";
import StatsSection from "@/components/marketing/stats-section/stats-section";
import AISection from "@/components/marketing/ai-section/ai-section";
import TemplatesPage from "@/components/marketing/templates/templates-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora — Your Complete Website Builder in Nepal",
  description:
    "Create modern websites, businesses, and portfolios with Nepdora.",
  keywords: [
    "website builder Nepal",
    "create website Nepal",
    "ecommerce Nepal",
    "portfolio website Nepal",
    "Nepdora",
    "Made in Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  alternates: {
    canonical: "https://www.nepdora.com",
  },
  openGraph: {
    title: "Nepdora — Your Complete Website Builder in Nepal",
    description:
      "Create modern websites, businesses, and portfolios with Nepdora.",
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
      "Create modern websites, businesses, and portfolios with Nepdora.",
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

  return (
    <>
      {/* SEO JSON-LD Structured Data */}
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-corporation"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(corporationSchema) }}
      />

      {/* Marketing Page Sections */}
      <div>
        <HeroSection />
        <StatsSection />
        <PricingSection />
        <FeaturesSection />
        <ProcessSection />
        <BuildYourWay />
        <AISection />
        <TemplatesPage />
        <TestimonialsSection />
        <ContactSection />
        <FAQSection />
      </div>
    </>
  );
}
