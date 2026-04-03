import { Metadata } from "next";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { capitalizeWords } from "@/lib/string-utils";
import Comparison from "@/components/marketing/comparison/comparison";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COMPETITORS.map(competitor => ({
    slug: `${competitor.slug}-nepal`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitorSlug = slug.replace("-nepal", "");
  const competitor = ALL_COMPETITORS.find(c => c.slug === competitorSlug);
  const name = competitor ? competitor.name : capitalizeWords(competitorSlug);

  const title = `Best ${name} Alternative in Nepal | Save 80% on Costs`;
  const description = `Looking for ${name} in Nepal? Discover why Nepdora is the best ${name} alternative for Nepali businesses. Local payments, better support, and affordable pricing.`;

  return {
    title,
    description,
    keywords: [
      `${name} alternative nepal`,
      `best website builder nepal`,
      `cheap ${name} nepal`,
    ],
  };
}

export default async function AlternativePage({ params }: Props) {
  const { slug } = await params;
  const competitorSlug = slug.replace("-nepal", "");
  const competitor = ALL_COMPETITORS.find(c => c.slug === competitorSlug);
  const name = competitor ? competitor.name : capitalizeWords(competitorSlug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Nepdora (${name} Alternative)`,
    description: `The best ${name} alternative for businesses in Nepal.`,
    brand: {
      "@type": "Brand",
      name: "Nepdora",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main>
      <JsonLd id="alt-schema" data={schema} />
      <div className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
            The Best <span className="text-primary">{name}</span> Alternative in
            Nepal
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Stop paying in USD with international credit cards. Switch to
            Nepdora and enjoy local support, eSewa/Khalti integration, and
            prices that make sense for the Nepalese market.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="bg-primary hover:bg-primary/90 rounded-full px-8 py-4 font-bold text-white transition-all"
            >
              See How You Save
            </Link>
          </div>
        </div>
      </div>

      <Comparison platformName={name} />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                Why Nepalese Businesses Prefer Nepdora Over {name}
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <p>
                    <strong>Payment integration:</strong> No more credit card
                    headaches. Native eSewa & Khalti support.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <p>
                    <strong>Local Support:</strong> Get help from a team that
                    understands your business environment and time zone.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <p>
                    <strong>Affordable NPR Pricing:</strong> Fixed costs in
                    Nepalese Rupees, avoiding fluctuating exchange rates.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <p>
                    <strong>Speed:</strong> Our servers are optimized for the
                    subcontinent, ensuring fast loads for your Nepali customers.
                  </p>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-900 p-8 text-white">
              <h3 className="mb-4 text-2xl font-bold">Ready to Switch?</h3>
              <p className="mb-8 text-slate-400">
                We offer free migration from {name} to Nepdora. Our team will
                handle the heavy lifting for you.
              </p>
              <Link
                href="/contact"
                className="group text-primary flex items-center gap-2 font-bold"
              >
                Contact migration team{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </main>
  );
}
