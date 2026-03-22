import { Metadata } from "next";
import Hero from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Free Website Builder Nepal | Build Your Site at Zero Cost",
  description: "Start your online presence for free with Nepdora. The best free website builder in Nepal with professional templates and easy-to-use tools. No credit card required.",
  keywords: ["free website builder nepal", "free website nepal", "zero cost website builder", "create free website nepal"],
};

export default function FreeWebsiteBuilder() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Nepdora Free Website Builder",
    "description": "Start building your online presence for free with Nepdora.",
    "url": "https://www.nepdora.com/free-website-builder",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NPR"
    }
  };

  return (
    <main>
      <JsonLd id="free-software-schema" data={schema} />
      <Hero />
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl text-slate-900">Start Your Business with Zero Initial Investment</h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">
            We believe every Nepali business deserves a place online. Start with our free tier, pick a professional template, 
            and launch your site in minutes. Upgrade only when you grow.
        </p>
      </div>
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
