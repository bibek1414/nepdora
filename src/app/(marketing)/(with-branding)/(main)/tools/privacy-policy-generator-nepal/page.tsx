import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Privacy Policy Generator for Nepali Websites | Free Tool",
  description:
    "Generate a legally compliant Privacy Policy for your Nepali business in seconds. Tailored for Nepal's IT and privacy laws.",
  path: "/tools/privacy-policy-generator-nepal",
  noIndex: true,
  keywords: [
    "privacy policy generator nepal",
    "legal policy nepal",
    "nepal it laws compliance",
  ],
});

export default function PrivacyPolicyGenerator() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Privacy Policy Generator Nepal",
        }}
      />
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Free Privacy Policy Generator for{" "}
              <span className="text-primary">Nepal</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Ensure your business website is compliant with local regulations.
              Generate a professional privacy policy in just a few clicks.
            </p>
          </div>

          <div className="mb-20 rounded-3xl bg-slate-900 p-10 text-white">
            <h2 className="mb-6 text-2xl font-bold">Coming Soon</h2>
            <p className="mb-0 text-slate-400">
              We are currently updating our policy templates to reflect the
              latest 2026 IT regulations in Nepal. Sign up below to be notified
              as soon as this tool goes live.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="mb-6 text-3xl font-bold">
              Why does your Nepali website need a Privacy Policy?
            </h2>
            <p>
              With the rise of e-commerce and digital payments in Nepal via
              eSewa and Khalti, collecting customer data has become a standard
              practice. Protecting this data is not just a legal requirement but
              a key component of building customer trust.
            </p>
          </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
