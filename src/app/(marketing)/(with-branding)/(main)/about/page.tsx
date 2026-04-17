import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import AboutHero from "@/components/marketing/about-us/about-hero";
import AboutStory from "@/components/marketing/about-us/about-story";
import AboutSecurity from "@/components/marketing/about-us/about-security";
import AboutValues from "@/components/marketing/about-us/about-values";
import AboutTeam from "@/components/marketing/about-us/about-team";
import CTA from "@/components/marketing/cta-section/cta-section";
import Testimonials from "@/components/marketing/testimonials/testimonials";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "About Nepdora – Made in Nepal Website Builder for Businesses",
  description:
    "Learn about Nepdora, a made-in-Nepal website builder designed for businesses. Create websites, online stores, and manage your digital presence with local payments and powerful tools.",
  path: "/about",
  keywords: [
    "About Nepdora",
    "Nepdora Nepal",
    "website builder Nepal",
    "made in Nepal software",
    "ecommerce platform Nepal",
    "Nepal startup website builder",
    "business software Nepal",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Nepdora",
  description:
    "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management in Nepal.",
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
    logo: DEFAULT_OG_IMAGE,
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
      <AboutSecurity />
      <AboutValues />
      <AboutTeam />
      <Testimonials />
      <CTA />
    </>
  );
}
