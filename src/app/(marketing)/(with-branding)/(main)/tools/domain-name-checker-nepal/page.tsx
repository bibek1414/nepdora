import { Metadata } from "next";
import { Suspense } from "react";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { buildMarketingMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import DomainNameCheckerClient from "./domain-name-checker-client";

export const metadata = buildMarketingMetadata({
  title: "Nepali Domain Name Checker | .com.np & .com Availability",
  description:
    "Check if your desired business name is available as a .com.np or .com domain in Nepal. Free and instant WHOIS search tool.",
  path: "/tools/domain-name-checker-nepal",
  keywords: [
    "nepali domain checker",
    "com np domain availability",
    "register domain nepal",
    "free domain nepal",
    "whois lookup nepal",
    "nepal domain search",
  ],
});

export default function DomainCheckerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nepali Domain Name Checker",
    description:
      "Instantly check domain name availability for .com, .com.np and more in Nepal.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    url: absoluteUrl("/tools/domain-name-checker-nepal"),
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <JsonLd id="tool-schema" data={schema} />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Decorative Background Elements */}
        <div className="bg-primary/5 pointer-events-none absolute -top-24 -right-24 h-[600px] w-[600px] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="relative container mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto mb-16 max-w-4xl">
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
              Local Registry Specialist
            </div>
            <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-slate-900 md:text-7xl lg:text-8xl">
              Find the perfect <br />
              <span className="text-primary italic">domain name.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
              I scan 500+ registries instantly to find the best .com, .com.np,
              or specialty extensions for your next big project.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="mx-auto h-[400px] w-full max-w-4xl animate-pulse rounded-[3rem] bg-slate-100" />
            }
          >
            <DomainNameCheckerClient />
          </Suspense>
        </div>
      </section>

      {/* Guide Section */}
      <section
        id="np-guide"
        className="border-t border-slate-100 bg-white py-24"
      >
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-slate prose-lg max-w-none">
            <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
              How to get a free .com.np domain in Nepal?
            </h2>
            <p className="mt-8 text-slate-600">
              Registration of <strong>.com.np</strong> domains is completely
              free for any person or business registered in Nepal. This service
              is provided by Mercantile Communications and is a great way to
              establish a local presence.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
                <h3 className="mt-0 text-xl font-bold">For Individuals</h3>
                <ul className="text-sm text-slate-600">
                  <li>Scanned copy of Nepali Citizenship/Passport</li>
                  <li>Domain name must be based on your official name</li>
                  <li>NP Portal account (register.com.np)</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
                <h3 className="mt-0 text-xl font-bold">For Businesses</h3>
                <ul className="text-sm text-slate-600">
                  <li>Company Registration certificate</li>
                  <li>PAN/VAT certificate</li>
                  <li>Cover letter on company letterhead</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 ring-primary/10 mt-12 rounded-2xl p-8 text-center ring-1">
              <h3 className="text-primary mt-0 text-xl font-bold">
                Need Help?
              </h3>
              <p className="mb-0 text-slate-600">
                Registering a .com.np domain can be tricky. Nepdora provides
                free assistance for all our hosting customers to get their
                .com.np domain approved and connected in hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </main>
  );
}
