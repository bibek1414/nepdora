import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy Generator for Nepali Websites | Free Tool",
  description: "Generate a legally compliant Privacy Policy for your Nepali business in seconds. Tailored for Nepal's IT and privacy laws.",
};

export default function PrivacyPolicyGenerator() {
  return (
    <main className="bg-white min-h-screen">
      <JsonLd id="tool-schema" data={{ "@context": "https://schema.org", "@type": "WebApplication", "name": "Privacy Policy Generator Nepal" }} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Free Privacy Policy Generator for <span className="text-primary">Nepal</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Ensure your business website is compliant with local regulations. 
                    Generate a professional privacy policy in just a few clicks.
                </p>
            </div>

            <div className="p-10 rounded-3xl bg-slate-900 text-white mb-20">
                <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
                <p className="text-slate-400 mb-0">
                    We are currently updating our policy templates to reflect the latest 2026 IT regulations in Nepal. 
                    Sign up below to be notified as soon as this tool goes live.
                </p>
            </div>

            <div className="prose prose-slate max-w-none">
                 <h2 className="text-3xl font-bold mb-6">Why does your Nepali website need a Privacy Policy?</h2>
                 <p>
                     With the rise of e-commerce and digital payments in Nepal via eSewa and Khalti, 
                     collecting customer data has become a standard practice. Protecting this data is 
                     not just a legal requirement but a key component of building customer trust.
                 </p>
            </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
