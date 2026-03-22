import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Website Speed Test Nepal | Optimize for Local Networks",
  description: "Check how fast your website loads in Nepal. Specialized speed test for NTC, Ncell, and local ISP connections.",
};

export default function SpeedTest() {
  return (
    <main className="bg-white min-h-screen">
      <JsonLd id="tool-schema" data={{ "@context": "https://schema.org", "@type": "WebApplication", "name": "Nepali Website Speed Test" }} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Website <span className="text-primary">Speed Test</span> Nepal
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Test your website's performance on Nepalese networks. Ensure your site is fast 
                    for all your local visitors.
                </p>
            </div>

            <div className="bg-slate-900 text-primary p-12 rounded-3xl shadow-2xl mb-20 font-mono text-center">
                [ SPEED ANALYSIS SYSTEM STARTING... ]
            </div>

            <div className="prose prose-slate max-w-none">
                 <h2 className="text-3xl font-bold mb-6">Speed matters for your business in Nepal</h2>
                 <p>
                     Slow websites kill conversions. In Nepal, where mobile internet can be inconsistent, 
                     optimizing your site for speed is non-negotiable. Nepdora websites are pre-optimized 
                     for maximum performance on all local networks.
                 </p>
            </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
