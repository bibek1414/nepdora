import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Nepali Business Name Generator | Find the Perfect Name for Your Startup",
  description: "Struggling to find a name for your Nepali business? Use our AI-powered name generator to find unique, catchy, and culturally relevant names in seconds.",
};

export default function BusinessNameGenerator() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Nepali Business Name Generator",
    "description": "Found uniquely Nepali business names for your next venture.",
    "url": "https://www.nepdora.com/tools/business-name-generator-nepal"
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <JsonLd id="tool-schema" data={schema} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                    Nepali <span className="text-primary">Business Name</span> Generator
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Generate hundreds of unique business names tailored for the Nepali market. 
                    Search by industry, vibe, or keyword.
                </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input placeholder="Enter a keyword (e.g. food, tech, fashion)" className="h-14 text-lg px-6 rounded-full" />
                    <Button className="h-14 px-10 text-lg rounded-full shrink-0">Generate Names</Button>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                    <span className="text-sm text-slate-500">Popular: </span>
                    <button className="text-sm px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">Restaurant</button>
                    <button className="text-sm px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">Fashion</button>
                    <button className="text-sm px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">Technology</button>
                </div>
            </div>

            <div className="mt-20 prose prose-slate max-w-none">
                <h2 className="text-3xl font-bold mb-6">How to choose a name for your business in Nepal?</h2>
                <p>
                    Choosing a name is one of the most important steps in starting your business in Nepal. 
                    A good name should be easy to pronounce, culturally relevant, and legally available for registration 
                    at the Office of Company Registrar (OCR).
                </p>
                <h3 className="text-xl font-bold mt-8 mb-4">Things to consider:</h3>
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
