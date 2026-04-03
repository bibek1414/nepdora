import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import AboutHero from "@/components/marketing/about-us/about-hero";
import AboutStory from "@/components/marketing/about-us/about-story";
import AboutSecurity from "@/components/marketing/about-us/about-security";
import AboutValues from "@/components/marketing/about-us/about-values";
import AboutTeam from "@/components/marketing/about-us/about-team";
import CTA from "@/components/marketing/cta-section/cta-section";
import Testimonials from "@/components/marketing/testimonials/testimonials";

export const metadata: Metadata = {
  title: "About Nepdora : Made in Nepal Website Builder",
  description:
    "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management. Build your complete digital presence here.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  keywords: [
    "Nepdora about",
    "Nepal website builder",
    "ecommerce platform Nepal",
    "digital presence solution",
    "Made in Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL(absoluteUrl()),
  openGraph: {
    title: "About Nepdora : Made in Nepal Website Builder",
    description:
      "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management. Build your complete digital presence here.",
    url: absoluteUrl("/about"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "About Nepdora - Made in Nepal Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Nepdora : Made in Nepal Website Builder",
    description:
      "Learn about Nepdora, the all-in-one platform for Website Development, E-commerce, and Social Media Management.",
    images: [DEFAULT_OG_IMAGE],
  },
};

import { JsonLd } from "@/components/shared/json-ld";

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

export default function AboutPage() {
  return (
    <div className="bg-white">
      <JsonLd id="about-schema" data={aboutSchema} />
      <AboutHero />
      <AboutStory />
      <div className="space-y-24 pb-24 sm:space-y-32 sm:pb-32 lg:space-y-48 lg:pb-48">
        <AboutSecurity />
        <AboutValues />
        <AboutTeam />
        <Testimonials />
        <CTA />
      </div>
    </div>
  );
}
