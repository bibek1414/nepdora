import { WebsiteAnalyzer } from "@/components/marketing/tools/website-analyzer";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Free Website Analyzer | Audit Your Site in Nepal | Nepdora",
  description:
    "Audit your website's SEO, speed, and mobile responsiveness for the Nepalese market. Get actionable insights to beat your local competitors.",
  path: "/free-website-analyzer",
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "website analyzer nepal",
    "free seo audit nepal",
    "website speed test nepal",
    "mobile friendly check nepal",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";

const analyzerSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: `${SITE_NAME} Website Analyzer`,
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NPR",
  },
  description:
    "A free tool to audit your website's SEO, speed, and mobile responsiveness for the Nepalese market.",
};

export default function FreeWebsiteAnalyzerPage() {
  return (
    <>
      <JsonLd id="analyzer-schema" data={analyzerSchema} />
      <WebsiteAnalyzer />
    </>
  );
}
