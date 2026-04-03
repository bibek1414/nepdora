import type { Metadata } from "next";
import { AlternativeHero } from "@/components/marketing/alternative/alternative-hero";
import { AlternativeContext } from "@/components/marketing/alternative/alternative-context";
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
const PLATFORM_NAME = "WordPress";
const pageUrl = absoluteUrl("/alternative/wordpress-nepal");
const pageTitle =
  "WordPress vs Nepdora (2026): Best Website Platform in Nepal?";
const pageDescription =
  "Comparing WordPress (WooCommerce) and Nepdora in Nepal? See why businesses switch from custom development to Nepdora for speed, security, and local payments.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "wordpress alternative nepal",
    "wordpress vs nepdora",
    "website builder nepal",
    "woocommerce nepal plugins",
    "esewa wordpress nepal",
    "khalti wordpress nepal",
    "best business website nepal",
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/wordpress-vs-nepdora.png", // Replace with actual asset if available
        width: 1200,
        height: 630,
        alt: "WordPress vs Nepdora — Best website platform in Nepal 2026",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
};

export default function WordPressAlternativePage() {
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nepdora",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Nepdora is the leading WordPress alternative in Nepal, providing an all-in-one platform for businesses that want a fast, secure website without the complexity of plugins and maintenance.",
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: "10000",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "15000",
    },
  };

  const comparisonRows = [
    {
      feature: "Setup speed",
      nepdora: "Minutes (AI-Powered)",
      opponent: "Days to Weeks (Developers needed)",
    },
    {
      feature: "Security",
      nepdora: "Enterprise SSL + Cloud hosting included",
      opponent: "Requires manual updates / plugin security",
    },
    {
      feature: "Ease of Use",
      nepdora: "One-sentence prompt creates store",
      opponent: "Complex dashboard / Page builders",
    },
    {
      feature: "Maintenance",
      nepdora: "Zero (Managed platform)",
      opponent: "Ongoing (Plugin conflicts / Speed optimization)",
    },
    {
      feature: "Pricing",
      nepdora: "NPR 10,000 / year flat",
      opponent: "Varies (Hosting + Domain + Developers)",
    },
  ];

  const reasons = [
    {
      title: "No Developer Retainer Needed",
      description:
        "Forget the need for a full-time or freelance developer to fix plugin conflicts or broken page layouts.",
    },
    {
      title: "Built-in Security",
      description:
        "Unlike WordPress, which is subject to frequent hacker attacks, Nepdora is a secure cloud-hosted platform with zero maintenance required.",
    },
    {
      title: "AI-Powered Creation",
      description:
        "Start with a live website built by AI in seconds, rather than choosing from thousands of generic themes that look outdated.",
    },
    {
      title: "Integrated Payments",
      description:
        "Accept local Nepal payments (eSewa, Khalti) out of the box without the technical debt of third-party plugins.",
    },
  ];

  const testimonials = [
    {
      quote:
        "WordPress was becoming too complex with constant updates and plugin errors. Nepdora simplified everything, and our site loads significantly faster.",
      name: "Brainstorm Abroad",
      role: "Education Consultancy, Kathmandu",
      href: "#",
    },
  ];

  const fitChecks = [
    "You want a faster, secure website without developers.",
    "You are tired of plugin conflicts and regular maintenance costs.",
    "You want an all-in-one platform for your business website.",
    "You need 24-hour local support from Kathmandu team.",
  ];

  const clusterLinks = [
    { label: "Blanxer vs Nepdora", href: "/alternative/blanxer-nepal" },
    { label: "Shopify vs Nepdora", href: "/alternative/shopify-nepal" },
    { label: "Wix vs Nepdora", href: "/alternative/wix-nepal" },
    { label: "Webflow vs Nepdora", href: "/alternative/webflow-nepal" },
  ];

  return (
    <main>
      <JsonLd id="wordpress-alt-software-schema" data={softwareAppSchema} />
      
      <AlternativeHero
        platformName={PLATFORM_NAME}
        description="WordPress is powerful, but for most Nepali businesses, it is slow and complex to maintain. Use Nepdora's AI for a faster, simpler, and more secure presence."
      />

      <AlternativeContext
        platformName={PLATFORM_NAME}
        context="WordPress powers over 40% of the web. It's the standard for massive blogs and complex custom portals. For most local companies, it requires juggling separate hosting, domain providers, developers, and security plugins — often becoming a technical headache."
        recommendation="If your business needs a simple, clean, commercial website with eSewa integration, Nepdora offers a smoother experience without the 'plugin fatigue' that comes with WordPress."
      />

      <Comparison platformName={PLATFORM_NAME} />

      <AlternativeTable platformName={PLATFORM_NAME} rows={comparisonRows} />

      <AlternativeValueProps
        platformName={PLATFORM_NAME}
        reasons={reasons}
        featureLinks={[]}
      />

      <AlternativePricing
        platformName={PLATFORM_NAME}
        traditionalCostLabel="Traditional WordPress Agency setup"
        traditionalCostValue="NPR 50,000 - 1,50,000 upfront"
        traditionalPoints={[
          "Agency Fee: NPR 50,000+",
          "Domain & Hosting: NPR 15,000/year",
          "Plugin Maintenance: NPR 5,000+/year",
          "One-off Speed Optimization: NPR 10,000+",
          "Developer/AMC: NPR 5,000+/month",
        ]}
        nepdoraPoints={[
          "All-in-one: NPR 10,000/year",
          "Everything Included: Domain + Hosting + SSL",
          "Daily Backups + Security",
          "Zero maintenance",
          "Local Onboarding session",
        ]}
      />

      <AlternativeTestimonials testimonials={testimonials} />

      <AlternativeFitCheck
        platformName={PLATFORM_NAME}
        fitChecks={fitChecks}
      />

      <AlternativeLinkCluster links={clusterLinks} />

      <FAQSection />
      <CTASection />
    </main>
  );
}
