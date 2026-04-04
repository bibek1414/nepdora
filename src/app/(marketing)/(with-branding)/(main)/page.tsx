import Script from "next/script";
import dynamic from "next/dynamic";
import HeroSection from "@/components/marketing/hero-section/hero-section";
import CapabilitiesSection from "@/components/marketing/features/capabilities-section";
import type { Metadata } from "next";
import CaseStudies from "@/components/marketing/case-studies/case-studies";
import Concierge from "@/components/marketing/concierge/concierge";
import UseCases from "@/components/marketing/use-cases/use-cases";
import QuickBuilder from "@/components/marketing/quick-builder/quick-builder";
import CTA from "@/components/marketing/cta-section/cta-section";
import Comparison from "@/components/marketing/comparison/comparison";
import Migration from "@/components/marketing/migration/migration";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

// Lazy load non-critical components to reduce initial load
const TestimonialsSection = dynamic(
  () => import("@/components/marketing/testimonials/testimonials"),
  { loading: () => <div className="py-20" /> }
);

const TemplatesPage = dynamic(
  () => import("@/components/marketing/templates/templates-page"),
  { loading: () => <div className="py-20" /> }
);

export const metadata = buildMarketingMetadata({
  title: "Website Builder Nepal | Free AI Website Builder for Nepali Businesses",
  description:
    "Build a website in Nepal in minutes with Nepdora. Launch ecommerce, service, and portfolio sites with eSewa, Khalti, hosting, and local support.",
  path: "/",
});

export default function Marketing() {
  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(),
    description:
      "Nepdora — Your complete platform for creating modern websites, businesses, and portfolios in Nepal.",
    image: absoluteUrl("/nepdora-image.jpg"),
    sameAs: [
      "https://www.facebook.com/NepdoraWebBuilder",
      "https://www.instagram.com/nep_dora",
    ],
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
    alternateName: SITE_NAME,
    url: absoluteUrl(),
    logo: absoluteUrl("/nepdora-logooo.svg"),
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
      <div className="mx-auto max-w-6xl px-2 md:px-0">
        <HeroSection />
        <TemplatesPage />
        <CapabilitiesSection />
        <CaseStudies />
        <UseCases />
        <QuickBuilder />
        <Comparison />
        <Migration />
        <Concierge />
        <TestimonialsSection />
        {/* <ContactSection /> */}
        <CTA />
      </div>
    </>
  );
}
