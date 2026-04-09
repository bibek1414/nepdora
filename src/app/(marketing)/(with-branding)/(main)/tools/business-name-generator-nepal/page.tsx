import { Metadata } from "next";
import { Suspense } from "react";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { BusinessNameGeneratorClient } from "./business-name-generator-client";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Nepali Business Name Generator | Find the Perfect Name for Your Startup",
  description:
    "Struggling to find a name for your Nepali business? Use our AI-powered name generator to find unique, catchy, and culturally relevant names in seconds.",
  path: "/tools/business-name-generator-nepal",
  keywords: [
    "business name generator nepal",
    "nepali startup names",
    "creative business names nepal",
    "brand name ideas nepal",
  ],
});

export default function BusinessNameGeneratorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nepali Business Name Generator",
    description: "Found uniquely Nepali business names for your next venture.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    url: absoluteUrl("/tools/business-name-generator-nepal"),
  };

  return (
    <main className="selection:bg-primary/20 min-h-screen bg-[#fafaf9]">
      <JsonLd id="tool-schema" data={schema} />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Orbs */}
        <div className="bg-primary/5 pointer-events-none absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full blur-3xl" />
        <div className="bg-secondary/10 pointer-events-none absolute top-20 -left-20 h-80 w-80 rounded-full blur-3xl" />

        <div className="relative container mx-auto max-w-6xl px-4 text-center">
          <div>
            {/* Badge */}

            <h1 className="mb-4 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Find the perfect business name in seconds
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Describe your idea, choose your style, and get unique, memorable
              names crafted just for you — powered by AI for the Nepali market.
            </p>

            <Suspense
              fallback={
                <div className="h-[400px] w-full animate-pulse rounded-[2.5rem] bg-slate-100" />
              }
            >
              <BusinessNameGeneratorClient />
            </Suspense>
          </div>
        </div>
      </section>

      <FAQSection />
    </main>
  );
}
