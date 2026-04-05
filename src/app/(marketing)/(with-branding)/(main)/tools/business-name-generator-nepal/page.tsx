import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
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

export default function BusinessNameGenerator() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nepali Business Name Generator",
    description: "Found uniquely Nepali business names for your next venture.",
    url: absoluteUrl("/tools/business-name-generator-nepal"),
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd id="tool-schema" data={schema} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Nepali <span className="text-primary">Business Name</span>{" "}
              Generator
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Generate hundreds of unique business names tailored for the Nepali
              market. Search by industry, vibe, or keyword.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl md:p-12">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                placeholder="Enter a keyword (e.g. food, tech, fashion)"
                className="h-14 rounded-full px-6 text-lg"
              />
              <Button className="h-14 shrink-0 rounded-full px-10 text-lg">
                Generate Names
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="text-sm text-slate-500">Popular: </span>
              <button className="rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
                Restaurant
              </button>
              <button className="rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
                Fashion
              </button>
              <button className="rounded-full bg-slate-100 px-3 py-1 text-sm transition-colors hover:bg-slate-200">
                Technology
              </button>
            </div>
          </div>

          <div className="prose prose-slate mt-20 max-w-none">
            <h2 className="mb-6 text-3xl font-bold">
              How to choose a name for your business in Nepal?
            </h2>
            <p>
              Choosing a name is one of the most important steps in starting
              your business in Nepal. A good name should be easy to pronounce,
              culturally relevant, and legally available for registration at the
              Office of Company Registrar (OCR).
            </p>
            <h3 className="mt-8 mb-4 text-xl font-bold">Things to consider:</h3>
            <ul>
              <li>Does it sound good in both Nepali and English?</li>
              <li>Is the .com.np domain available (it's free!)?</li>
              <li>Does it represent your brand values clearly?</li>
            </ul>
          </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
