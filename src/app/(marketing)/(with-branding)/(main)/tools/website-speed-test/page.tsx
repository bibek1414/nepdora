import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Website Speed Test Nepal | Optimize for Local Networks",
  description:
    "Check how fast your website loads in Nepal. Specialized speed test for NTC, Ncell, and local ISP connections.",
  path: "/tools/website-speed-test",
  noIndex: true,
  keywords: [
    "website speed test nepal",
    "ntc ncell speed test",
    "isp speed check nepal",
    "optimize website nepal",
  ],
});

export default function SpeedTest() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Nepali Website Speed Test",
        }}
      />
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Website <span className="text-primary">Speed Test</span> Nepal
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Test your website&apos;s performance on Nepalese networks. Ensure
              your site is fast for all your local visitors.
            </p>
          </div>

          <div className="text-primary mb-20 rounded-3xl bg-slate-900 p-12 text-center font-mono shadow-2xl">
            [ SPEED ANALYSIS SYSTEM STARTING... ]
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="mb-6 text-3xl font-bold">
              Speed matters for your business in Nepal
            </h2>
            <p>
              Slow websites kill conversions. In Nepal, where mobile internet
              can be inconsistent, optimizing your site for speed is
              non-negotiable. Nepdora websites are pre-optimized for maximum
              performance on all local networks.
            </p>
          </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
