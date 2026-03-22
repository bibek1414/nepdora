import { Metadata } from "next";
import { industries, MAJOR_CITIES, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";

interface Props {
  params: Promise<{ industry: string; city: string }>;
}

export async function generateStaticParams() {
  return industries.flatMap((industry) =>
    MAJOR_CITIES.map((city) => ({
      industry,
      city,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, city } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  return {
    title: `Create ${industryLabel} Website in ${cityName} | Nepdora`,
    description: `Build your ${industryLabel.toLowerCase()} website in ${cityName} today. Integrated eSewa, Khalti, and local delivery. Launch your business in minutes!`,
  };
}

export default async function CreateWebsiteForPage({ params }: Props) {
  const { industry, city } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Create ${industryLabel} Website in ${cityName}`,
    "description": `Professional website building services for ${industryLabel.toLowerCase()}s in ${cityName}, Nepal.`,
    "areaServed": {
      "@type": "City",
      "name": cityName
    },
    "provider": {
      "@type": "Organization",
      "name": "Nepdora"
    }
  };

  return (
    <main>
      <JsonLd id="pseo-schema" data={schema} />
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
          <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900">
                  Create <span className="text-primary">{industryLabel}</span> Website in <span className="text-primary">{cityName}</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
                  Launch your {industryLabel.toLowerCase()} business online in {cityName} with Nepdora. 
                  Accept payments via eSewa & Khalti and reach thousands of customers in your local area.
              </p>
              <div className="flex justify-center">
                   <Link href="/create-website" className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all text-lg underline-offset-4 decoration-primary">
                    Start Building in {cityName}
                   </Link>
              </div>
          </div>
      </section>

      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">Why Choose Nepdora for your {industryLabel} in {cityName}?</h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Nepdora provides the most localized website builder platform in Nepal. 
            We handle everything—from design to payments—tailored specifically for businesses in {cityName}.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Local Payments</h3>
                <p className="text-slate-600">Integrated eSewa, Khalti, and FonePay support for your customers in {cityName}.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Local Logistics</h3>
                <p className="text-slate-600">Ship your products across {cityName} with our integrated delivery partners.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Nepali SEO</h3>
                <p className="text-slate-600">Rank #1 in Google when customers in {cityName} search for your services.</p>
            </div>
        </div>
      </div>

      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
