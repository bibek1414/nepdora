import { Metadata } from "next";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import AboutHero from "@/components/marketing/about-us/about-hero";
import AboutStory from "@/components/marketing/about-us/about-story";
import AboutStats from "@/components/marketing/about-us/about-stats";

import AboutLocal from "@/components/marketing/about-us/about-local";
import AboutDifference from "@/components/marketing/about-us/about-difference";
import AboutPhilosophy from "@/components/marketing/about-us/about-philosophy";
import AboutTeam from "@/components/marketing/about-us/about-team";
import CTA from "@/components/marketing/cta-section/cta-section";
import ContactSection from "@/components/marketing/contact-us/contact-us";

export const metadata: Metadata = buildMarketingMetadata({
  title: "About Nepdora | Website Builder Built for Nepal",
  description:
    "Nepdora is a modern website platform built to help 2,000+ Nepali businesses launch and scale online. Discover our story, expert ecosystem, and mission to empower local entrepreneurs.",
  path: "/about",
  keywords: [
    "nepdora",
    "website builder nepal",
    "nepali business website",
    "nepdora experts",
    "local payment integration",
    "esewa khalti",
  ],
});

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Nepdora",
  description:
    "Nepdora is a modern website platform built to help Nepali businesses launch, grow, and scale online—without complexity.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
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
      name: "About",
      item: absoluteUrl("/about"),
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd id="about-schema" data={aboutSchema} />
      <JsonLd id="about-breadcrumb" data={breadcrumbSchema} />

      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutDifference />
      <AboutLocal />
      <AboutPhilosophy />
      <AboutTeam />
      <ContactSection />
      <CTA />
    </>
  );
}
