import type { Metadata } from "next";
import { AlternativeHero } from "@/components/marketing/alternative/alternative-hero";

import { AlternativeTable } from "@/components/marketing/alternative/alternative-table";
import { AlternativeValueProps } from "@/components/marketing/alternative/alternative-value-props";
import { AlternativePricing } from "@/components/marketing/alternative/alternative-pricing";
import { AlternativeTestimonials } from "@/components/marketing/alternative/alternative-testimonials";
import { AlternativeFitCheck } from "@/components/marketing/alternative/alternative-fit-check";
import { AlternativeLinkCluster } from "@/components/marketing/alternative/alternative-link-cluster";
import Comparison from "@/components/marketing/comparison/comparison";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

// ─── Page-level constants ────────────────────────────────────────────────────
const PLATFORM_NAME = "Blanxer";
const pageUrl = absoluteUrl("/alternative/blanxer-nepal");
const pageTitle =
  "Blanxer vs Nepdora (2026): Which Website Builder Wins for Nepal?";
const pageDescription =
  "Comparing Blanxer and Nepdora for your Nepal business? See a full feature, pricing, and support comparison - eSewa, Khalti, logistics, POS, and AI builder included.";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/alternative/blanxer-nepal",
  image: "/blanxer_vs_nepdora_comparison_1775212183481.png",
  keywords: [
    "blanxer alternative nepal",
    "blanxer vs nepdora",
    "blanxer pos alternative nepal",
    "blanxer ecommerce alternative",
    "website builder nepal",
    "esewa khalti website builder nepal",
    "online store builder nepal",
    "nepal website builder with logistics",
    "website builder with pos nepal",
    "local website platform nepal",
  ],
});

export default function BlanxerAlternativePage() {
  // Schema definitions
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nepdora",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Nepdora is a Nepal-focused website builder with built-in eSewa/Khalti payments, AI builder, POS system, logistics integration (Pathao, YDM, Dash), and flat NPR 10,000/year pricing - a direct alternative to Blanxer.",
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: "10000",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "15000",
      bestRating: "5",
      worstRating: "1",
    },
    brand: {
      "@type": "Brand",
      name: "Nepdora",
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
        name: "Alternatives",
        item: absoluteUrl("/pricing"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Blanxer Alternative Nepal",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Blanxer and how is it different from Nepdora?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Blanxer is a Nepal-based commerce OS focused on omnichannel selling - online store, POS, inventory, and logistics from one system. Nepdora is a website builder for Nepali businesses that offers a faster path to launch, flat-rate pricing of NPR 10,000/year, built-in eSewa/Khalti/Fonepay payments, AI site builder, and hands-on local support.",
        },
      },
      {
        "@type": "Question",
        name: "Who should choose Nepdora instead of Blanxer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepdora is the better fit for service businesses, consultancies, restaurants, clinics, and small-to-medium online stores in Nepal that want a live website within minutes rather than days, with a simpler setup and predictable yearly pricing.",
        },
      },
      {
        "@type": "Question",
        name: "Does Nepdora support eSewa, Khalti, and Fonepay payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Nepdora has built-in integrations for eSewa, Khalti, and Fonepay - Nepal's major digital payment gateways - so you can start accepting payments without a separate technical setup.",
        },
      },
      {
        "@type": "Question",
        name: "Can Nepdora handle e-commerce and service websites?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Nepdora supports product catalogs, online orders, service booking pages, restaurant menus, business landing pages, and Nepal-focused website flows across industries.",
        },
      },
      {
        "@type": "Question",
        name: "How much does Nepdora cost compared to Blanxer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepdora charges a flat NPR 10,000 per year - hosting, SSL, daily backups, and maintenance all included with no hidden fees. This compares favorably to platforms that charge separately for domain, hosting, and maintenance.",
        },
      },
      {
        "@type": "Question",
        name: "Is migration support from Blanxer to Nepdora available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Nepdora's team can help move content, restructure pages, reconnect payment gateways, and simplify the transition for businesses changing platforms - at no extra cost.",
        },
      },
      {
        "@type": "Question",
        name: "Does Nepdora have a POS system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Nepdora includes a built-in POS system for physical retail and restaurant operations, with inventory sync across online and offline channels.",
        },
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    datePublished: "2025-01-01",
    dateModified: "2026-04-03",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbSchema.itemListElement,
    },
    about: [
      {
        "@type": "SoftwareApplication",
        name: "Nepdora",
        url: absoluteUrl("/"),
      },
      {
        "@type": "SoftwareApplication",
        name: "Blanxer",
        url: "https://www.blanxer.com",
      },
    ],
  };

  const comparisonRows = [
    {
      feature: "Launch time",
      nepdora: "5 minutes (AI builder)",
      opponent: "Hours to days",
    },
    {
      feature: "eSewa / Khalti / Fonepay",
      nepdora: "Built-in, no setup",
      opponent: "Available",
    },
    {
      feature: "AI website builder",
      nepdora: "✓ Included",
      opponent: "✗ Not available",
    },
    {
      feature: "POS system",
      nepdora: "✓ Included",
      opponent: "✓ Included",
    },
    {
      feature: "Logistics (Pathao, YDM, Dash)",
      nepdora: "✓ Included",
      opponent: "✓ Included",
    },
    {
      feature: "Pricing",
      nepdora: "NPR 10,000 / year flat",
      opponent: "Varies by plan",
    },
    {
      feature: "SSL + hosting included",
      nepdora: "✓ Always included",
      opponent: "Depends on plan",
    },
    {
      feature: "Free migration support",
      nepdora: "✓ Included (worth NPR 15,000)",
      opponent: "✗ Not offered",
    },
    {
      feature: "SEO (JSON-LD, Core Web Vitals)",
      nepdora: "✓ Automated",
      opponent: "Basic",
    },
    {
      feature: "Service business support",
      nepdora: "✓ Clinics, restaurants, agencies",
      opponent: "Primarily retail/commerce",
    },
    {
      feature: "1-on-1 onboarding",
      nepdora: "✓ Included",
      opponent: "Demo available",
    },
  ];

  const reasons = [
    {
      title: "Faster launch - live in 5 minutes",
      description:
        "Nepdora's AI builder creates a fully customized, SEO-ready website from a single sentence about your business. No design skills or developer needed.",
    },
    {
      title: "Local payments out of the box",
      description:
        "eSewa, Khalti, and Fonepay are built in. No separate developer setup, no API keys to manage - just connect your merchant account and start accepting payments.",
    },
    {
      title: "Flat, predictable pricing",
      description:
        "NPR 10,000/year covers everything: hosting, SSL, daily backups, and maintenance. No surprise renewal fees, no per-transaction cuts on top of payment gateway charges.",
    },
    {
      title: "Direct hands-on support",
      description:
        "Nepdora's team handles setup, payment integration, and onboarding with you - not via a help-desk ticket queue. One-on-one support from Kathmandu.",
    },
  ];

  const featureLinks = [
    { label: "eSewa Integration", href: "/integrations/esewa-payment" },
    { label: "Khalti Integration", href: "/integrations/khalti-payment" },
    { label: "Logistics (Pathao Parcel)", href: "/integrations/pathao-parcel" },
    { label: "POS System", href: "/integrations/pos-system" },
    { label: "AI Website Builder", href: "/ai-website-builder-in-nepdora" },
    { label: "SMS Notifications", href: "/integrations/sms-notifications" },
  ];

  const testimonials = [
    {
      quote:
        "We switched from another platform and Nepdora had our site live the same day. The eSewa integration was already set up - we just connected our merchant account.",
      name: "Infin Consultants",
      role: "Accounting & Business Setup, Kathmandu",
      href: "https://infinconsultants.com/",
    },
    {
      quote:
        "Bato Ma's rental website needed to handle bookings and payments. Nepdora handled everything in one place. The flat pricing means no surprises every month.",
      name: "Bato Ma Tours",
      role: "EV Rental, Kathmandu",
      href: "https://batomatours.com/",
    },
  ];

  const fitChecks = [
    "You want a Nepal-focused website platform, not a global generic tool.",
    "You need to go from idea to live site in under a day.",
    "You need eSewa, Khalti, or Fonepay without a custom integration.",
    "You want a flat annual price with no hidden hosting or maintenance fees.",
    "You run a service, restaurant, clinic, or single-location store - not a large multi-location retail chain.",
    "You want a platform your team can manage without a developer on retainer.",
  ];

  const clusterLinks = [
    { label: "Shopify vs Nepdora", href: "/alternative/shopify-nepal" },
    { label: "WordPress vs Nepdora", href: "/alternative/wordpress-nepal" },
    { label: "Wix vs Nepdora", href: "/alternative/wix-nepal" },
    { label: "Webflow vs Nepdora", href: "/alternative/webflow-nepal" },
  ];

  return (
    <main>
      <JsonLd id="blanxer-alt-software-schema" data={softwareAppSchema} />
      <JsonLd id="blanxer-alt-breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="blanxer-alt-faq-schema" data={faqSchema} />
      <JsonLd id="blanxer-alt-webpage-schema" data={webPageSchema} />

      <AlternativeHero
        platformName={PLATFORM_NAME}
        description="The real question is not just features. It is how quickly you can launch, how easily you can sell, and how much ongoing overhead you carry after going live. Here is a full, honest comparison."
      />

      <Comparison platformName={PLATFORM_NAME} />

      <AlternativeTable platformName={PLATFORM_NAME} rows={comparisonRows} />

      <AlternativeValueProps
        platformName={PLATFORM_NAME}
        reasons={reasons}
        featureLinks={featureLinks}
      />

      <AlternativePricing
        platformName={PLATFORM_NAME}
        traditionalCostLabel="Traditional setup in Nepal"
        traditionalCostValue="NPR 1,50,000+ upfront"
        traditionalPoints={[
          "Web agency or freelancer: NPR 50,000–1,50,000",
          "Domain: NPR 2,000/year",
          "Hosting: NPR 15,000–25,000/year",
          "SSL: NPR 5,000–10,000/year",
          "Maintenance: NPR 5,000+/month",
          "Payment gateway setup: NPR 10,000+",
        ]}
        nepdoraPoints={[
          "Hosting + Unlimited bandwidth",
          "Corporate SSL included",
          "Daily backups + maintenance",
          "eSewa / Khalti / Fonepay built in",
          "Free migration (worth NPR 15,000)",
          "1-on-1 onboarding session",
        ]}
      />

      <AlternativeTestimonials testimonials={testimonials} />

      <AlternativeFitCheck platformName={PLATFORM_NAME} fitChecks={fitChecks} />

      <AlternativeLinkCluster links={clusterLinks} />

      <FAQSection />
      <CTASection />
    </main>
  );
}
