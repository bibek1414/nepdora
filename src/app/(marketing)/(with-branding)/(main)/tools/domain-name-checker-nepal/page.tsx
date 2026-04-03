import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Nepali Domain Name Checker | .com.np & .com Availability",
  description:
    "Check if your desired business name is available as a .com.np or .com domain in Nepal. Free and instant search tool.",
  alternates: {
    canonical: absoluteUrl("/tools/domain-name-checker-nepal"),
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Nepali Domain Name Checker | .com.np & .com Availability",
    description:
      "Check if your desired business name is available as a .com.np or .com domain in Nepal. Free and instant search tool.",
    url: absoluteUrl("/tools/domain-name-checker-nepal"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora Domain Name Checker",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepali Domain Name Checker | .com.np & .com Availability",
    description:
      "Check if your desired business name is available as a .com.np or .com domain in Nepal. Free and instant search tool.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DomainChecker() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Nepali Domain Checker",
        }}
      />
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Nepali <span className="text-primary">Domain Name</span> Checker
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Instantly check domain availability for your business. Find the
              best .com or .com.np domain for your brand in Nepal.
            </p>
          </div>

          <div className="mb-20 rounded-3xl border border-slate-100 bg-slate-50 p-10">
            <h2 className="mb-6 text-2xl font-bold italic">
              Domain Search coming soon...
            </h2>
            <p>
              Register your domain through Nepdora and get free SSL and hosting
              integration.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="mb-6 text-3xl font-bold">
              How to get a free .com.np domain in Nepal?
            </h2>
            <p>
              Registration of .com.np domains is free for any person or business
              in Nepal. You&apos;ll need a scanned copy of your citizenship or
              company registration document. Nepdora makes it easy to connect
              your free .com.np domain to your website.
            </p>
          </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
