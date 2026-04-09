import { Metadata } from "next";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import FeaturesHero from "@/components/marketing/features/features-hero";
import FeatureShowcase from "@/components/marketing/features/feature-showcase";
import IntegrationsFeature from "@/components/marketing/features/integrations-feature";
import CTA from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Nepdora Features: Website Builder, E-commerce & Payment Tools for Nepal",
  description:
    "Explore every Nepdora feature — AI website builder, eSewa & Khalti payments, built-in SEO, e-commerce, CRM, SMS, logistics, and real-time analytics. Built for Nepali businesses.",
  path: "/features",
  keywords: [
    "Nepdora features",
    "website builder Nepal",
    "eSewa Khalti payment integration",
    "ecommerce features Nepal",
    "SEO tools Nepal",
    "online store Nepal",
    "website builder features",
    "Nepal business software",
  ],
});

const featuresSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nepdora Website Builder",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: absoluteUrl("/features"),
  description:
    "Nepdora is a complete website building and e-commerce platform for Nepali businesses. Includes AI website builder, eSewa & Khalti payments, built-in SEO tools, real-time analytics, CRM, SMS logistics, and 100+ professional templates.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  featureList: [
    "AI Website Builder with 100+ templates",
    "eSewa and Khalti payment gateway integration",
    "Khalti and Fonepay support",
    "Stripe and PayPal for international payments",
    "Mobile-first responsive design",
    "Built-in SEO with auto meta tags and schema markup",
    "Real-time analytics dashboard",
    "E-commerce with inventory management",
    "POS system for physical stores",
    "Mini CRM for customer management",
    "SMS notifications and logistics integration",
    "Custom domain with free SSL",
    "Appointment and booking system",
    "Blog and content management",
  ],
  offers: {
    "@type": "Offer",
    price: "10000",
    priceCurrency: "NPR",
    description: "Annual business plan with all features included",
  },
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
      name: "Features",
      item: absoluteUrl("/features"),
    },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <JsonLd id="features-app-schema" data={featuresSchema} />
      <JsonLd id="features-breadcrumb" data={breadcrumbSchema} />

      <FeaturesHero />
      <FeatureShowcase />
      <IntegrationsFeature />
      <CTA />
    </>
  );
}
