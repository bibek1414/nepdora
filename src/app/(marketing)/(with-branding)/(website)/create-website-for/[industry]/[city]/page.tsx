import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  industries,
  MAJOR_CITIES,
  INDUSTRY_LABELS,
  cities,
} from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const revalidate = 3600; // Cache for 1 hour

interface Props {
  params: Promise<{ industry: string; city: string }>;
}

export async function generateStaticParams() {
  return industries.flatMap(industry =>
    MAJOR_CITIES.map(city => ({
      industry,
      city,
    }))
  );
}

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, city } = await params;
  if (!industries.includes(industry) || !cities.includes(city.toLowerCase())) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  const title = `Create ${industryLabel} Website in ${cityName} | Nepdora`;
  const description = `Build your ${industryLabel.toLowerCase()} website in ${cityName} today. Integrated eSewa, Khalti, and local delivery. Launch your business in minutes!`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/admin/signup-for/${industry}/${city}`,
  });
}

export default async function CreateWebsiteForPage({ params }: Props) {
  const { industry, city } = await params;
  if (!industries.includes(industry) || !cities.includes(city.toLowerCase())) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Create ${industryLabel} Website in ${cityName}`,
    description: `Professional website building services for ${industryLabel.toLowerCase()}s in ${cityName}, Nepal.`,
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  return (
    <main>
      <JsonLd id="pseo-schema" data={schema} />
      <section className="border-b border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Create <span className="text-primary">{industryLabel}</span> Website
            in <span className="text-primary">{cityName}</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-600">
            Launch your {industryLabel.toLowerCase()} business online in{" "}
            {cityName} with Nepdora. Accept payments via eSewa & Khalti and
            reach thousands of customers in your local area.
          </p>
          <div className="flex justify-center">
            <Link
              href="/admin/signup"
              className="decoration-primary rounded-full bg-slate-900 px-10 py-5 text-lg font-bold text-white underline-offset-4 transition-all hover:bg-slate-800"
            >
              Start Building in {cityName}
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          Why Choose Nepdora for your {industryLabel} in {cityName}?
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">
          Nepdora provides the most localized website builder platform in Nepal.
          We handle everything-from design to payments-tailored specifically for
          businesses in {cityName}.
        </p>
        <div className="mt-16 grid gap-8 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-xl font-bold">Local Payments</h3>
            <p className="text-slate-600">
              Integrated eSewa, Khalti, and FonePay support for your customers
              in {cityName}.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-xl font-bold">Local Logistics</h3>
            <p className="text-slate-600">
              Ship your products across {cityName} with our integrated delivery
              partners.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-xl font-bold">Nepali SEO</h3>
            <p className="text-slate-600">
              Rank #1 in Google when customers in {cityName} search for your
              services.
            </p>
          </div>
        </div>
      </div>

      <FeaturesSection />
      <FAQSection />
      <CTASection cityName={cityName} category={industry} />
    </main>
  );
}
