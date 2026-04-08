import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title:
    "AI Website Builder Nepal | Build Your Site with Artificial Intelligence",
  description:
    "Experience the power of AI to build your website in minutes. The first AI-powered website builder for Nepal that understands your local business needs.",
  path: "/ai-website-builder",
  keywords: [
    "ai website builder nepal",
    "artificial intelligence website builder",
    "auto build website nepal",
  ],
});

export default function AIWebsiteBuilder() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} AI Website Builder`,
    description:
      "The first AI-powered website builder for Nepal. Tell us your business name and we build the rest.",
    url: absoluteUrl("/ai-website-builder"),
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
      <JsonLd id="ai-software-schema" data={schema} />
      <StandardMarketingHero
        badgeText="AI-powered building"
        title={
          <>
            Build your website with{" "}
            <span className="text-sky-600">artificial intelligence.</span>
          </>
        }
        description="Experience the power of AI to build your website in minutes. The first AI-powered website builder for Nepal that understands your local business needs."
      />

      <div className="bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            The future of website building in Nepal
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed font-medium text-slate-500">
            Forget complex editors. Simply describe your business, and our AI
            will generate a custom layout, write localized content for Nepal,
            and optimize your images automatically.
          </p>
        </div>
      </div>

      <FeaturesSection />

      <StandardMarketingCTA
        title="Ready to build with AI?"
        description="Start building your professional website today. No coding, no hassle—just AI-powered results."
        buttonText="Get started for free"
        buttonHref="/create-website"
      />
    </main>
  );
}
