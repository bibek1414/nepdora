import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import { HomePricingSection } from "@/components/marketing/pricing-section/home-pricing-section";
import { HomeFAQSection } from "@/components/marketing/faq-section/home-faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Sparkles } from "lucide-react";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Free Website Builder Nepal | Build Your Site at Zero Cost",
  description:
    "Start your online presence for free with Nepdora. The best free website builder in Nepal with professional templates and easy-to-use tools. No credit card required.",
  path: "/free-website-builder",
  keywords: [
    "free website builder nepal",
    "free website nepal",
    "zero cost website builder",
    "create free website nepal",
  ],
});

export default function FreeWebsiteBuilder() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} Free Website Builder`,
    description: "Start building your online presence for free with Nepdora.",
    url: absoluteUrl("/free-website-builder"),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  return (
    <main>
      <JsonLd id="free-software-schema" data={schema} />
      <StandardMarketingHero
        badgeText="Zero initial investment"
        badgeIcon={Sparkles}
        title={
          <>
            Nepal's best{" "}
            <span className="text-sky-600">free website builder.</span>
          </>
        }
        description="We believe every Nepali business deserves a place online. Start with our free tier, pick a professional template, and launch your site in minutes."
      />

      <div className="bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Start your business with zero initial investment
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed font-medium text-slate-500">
            Nepdora is dedicated to helping local entrepreneurs. Our free plan
            includes everything you need to test your idea and grow at your own
            pace. Upgrade only when you're ready.
          </p>
        </div>
      </div>

      <FeaturesSection />
      <HomePricingSection />
      <HomeFAQSection />

      <StandardMarketingCTA
        title="Launch your free site today"
        description="Join thousands of Nepali businesses already online. It's free, forever, until you decide to grow."
        buttonText="Create my free website"
        buttonHref="/create-website"
      />
    </main>
  );
}
