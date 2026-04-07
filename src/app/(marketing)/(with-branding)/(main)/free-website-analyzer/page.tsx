import { WebsiteAnalyzer } from "@/components/marketing/tools/website-analyzer";
import { JsonLd } from "@/components/shared/json-ld";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import { BarChart } from "lucide-react";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Free Website Analyzer | Audit Your Site in Nepal | Nepdora",
  description:
    "Audit your website's SEO, speed, and mobile responsiveness for the Nepalese market. Get actionable insights to beat your local competitors.",
  path: "/free-website-analyzer",
  keywords: [
    "website analyzer nepal",
    "free seo audit nepal",
    "website speed test nepal",
    "mobile friendly check nepal",
  ],
});

const analyzerSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nepdora Website Analyzer",
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
    <main className="min-h-screen bg-white">
      <JsonLd id="analyzer-schema" data={analyzerSchema} />
      
      <StandardMarketingHero
        badgeText="Free SEO tool"
        badgeIcon={BarChart}
        title={
          <>
            Free website <span className="text-sky-600">analyzer.</span>
          </>
        }
        description="Audit your website's SEO, speed, and mobile responsiveness for the Nepalese market. Discover how to improve your presence in Nepal."
        centered
      />

      <div className="py-20 bg-slate-50">
        <WebsiteAnalyzer />
      </div>

      <StandardMarketingCTA
        title="Ready to fix your site?"
        description="Build a high-performance website that ranks in Nepal. Start building for free with Nepdora."
        buttonText="Get started for free"
        buttonHref="/create-website"
      />
    </main>
  );
}
