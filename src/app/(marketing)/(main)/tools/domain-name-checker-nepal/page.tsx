import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Nepali Domain Name Checker | .com.np & .com Availability",
  description: "Check if your desired business name is available as a .com.np or .com domain in Nepal. Free and instant search tool.",
};

export default function DomainChecker() {
  return (
    <main className="bg-white min-h-screen">
      <JsonLd id="tool-schema" data={{ "@context": "https://schema.org", "@type": "WebApplication", "name": "Nepali Domain Checker" }} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Nepali <span className="text-primary">Domain Name</span> Checker
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Instantly check domain availability for your business. Find the best .com or .com.np domain 
                    for your brand in Nepal.
                </p>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 mb-20">
                <h2 className="text-2xl font-bold mb-6 italic">Domain Search coming soon...</h2>
                <p>Register your domain through Nepdora and get free SSL and hosting integration.</p>
            </div>

            <div className="prose prose-slate max-w-none">
                 <h2 className="text-3xl font-bold mb-6">How to get a free .com.np domain in Nepal?</h2>
                 <p>
                     Registration of .com.np domains is free for any person or business in Nepal. 
                     You'll need a scanned copy of your citizenship or company registration document. 
                     Nepdora makes it easy to connect your free .com.np domain to your website.
                 </p>
            </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
