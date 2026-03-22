import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Free SEO Checker for Nepali Websites | Rank Higher on Google",
  description: "Analyze your website's SEO performance and get actionable tips to rank #1 in Nepal. specialized for the Nepalese search landscape.",
};

export default function SEOChecker() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <JsonLd id="tool-schema" data={{ "@context": "https://schema.org", "@type": "WebApplication", "name": "Nepali SEO Checker" }} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Free <span className="text-primary">SEO Checker</span> for Nepal
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Get a detailed SEO report for your website. Learn how to beat your competitors 
                    in the Nepali search market.
                </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl mb-20 text-center">
                <p className="text-slate-500 mb-0 italic">SEO Analysis Engine Under Maintenance...</p>
            </div>

            <div className="prose prose-slate max-w-none">
                 <h2 className="text-3xl font-bold mb-6">Why SEO is different in Nepal?</h2>
                 <p>
                     Ranking in Nepal requires a mix of local and global SEO strategies. 
                     From targeting city-specific keywords like "Best restaurant in Kathmandu" to 
                     ensuring your site loads fast on NTC/Ncell networks, we help you master the local landscape.
                 </p>
            </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
