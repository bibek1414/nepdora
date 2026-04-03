import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free SEO Checker for Nepali Websites | Rank Higher on Google",
  description:
    "Analyze your website's SEO performance and get actionable tips to rank #1 in Nepal. specialized for the Nepalese search landscape.",
  alternates: {
    canonical: absoluteUrl("/tools/seo-checker"),
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Free SEO Checker for Nepali Websites | Rank Higher on Google",
    description:
      "Analyze your website's SEO performance and get actionable tips to rank #1 in Nepal. specialized for the Nepalese search landscape.",
    url: absoluteUrl("/tools/seo-checker"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora SEO Checker",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SEO Checker for Nepali Websites | Rank Higher on Google",
    description:
      "Analyze your website's SEO performance and get actionable tips to rank #1 in Nepal. specialized for the Nepalese search landscape.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SEOChecker() {
  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Nepali SEO Checker",
        }}
      />
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Free <span className="text-primary">SEO Checker</span> for Nepal
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Get a detailed SEO report for your website. Learn how to beat your
              competitors in the Nepali search market.
            </p>
          </div>

          <div className="mb-20 rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="mb-0 text-slate-500 italic">
              SEO Analysis Engine Under Maintenance...
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="mb-6 text-3xl font-bold">
              Why SEO is different in Nepal?
            </h2>
            <p>
              Ranking in Nepal requires a mix of local and global SEO
              strategies. From targeting city-specific keywords like &quot;Best
              restaurant in Kathmandu&quot; to ensuring your site loads fast on
              NTC/Ncell networks, we help you master the local landscape.
            </p>
          </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
