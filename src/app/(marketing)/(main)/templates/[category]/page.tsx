import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { TemplateSection } from "@/components/marketing/templates/template-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";

interface Props {
  params: Promise<{ category: string }>;
}

const TEMPLATE_CATEGORIES = [
  "restaurant",
  "ecommerce",
  "portfolio",
  "agency",
  "business",
  "educational",
  "travel",
  "grocery",
  "medical",
];

export async function generateStaticParams() {
  return TEMPLATE_CATEGORIES.map(category => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = capitalizeWords(category);
  const title = `Best ${name} Website Templates for Nepal | Ready to Use`;
  const description = `Browse free and premium ${name} templates designed for the Nepali market. Mobile-friendly, fast, and integrated with eSewa & Khalti.`;

  return {
    title,
    description,
    keywords: [
      `${category} website templates nepal`,
      `${category} website design nepal`,
    ],
  };
}

export default async function TemplateCategoryPage({ params }: Props) {
  const { category } = await params;
  const name = capitalizeWords(category);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} Website Templates`,
    description: `Professionally designed website templates for ${name} businesses in Nepal.`,
  };

  return (
    <main>
      <JsonLd id="template-coll-schema" data={schema} />
      <div className="border-b border-slate-200 bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            {name} Website Templates
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-600">
            Choose the best {name.toLowerCase()} templates in Nepal with online
            ordering, payment integration, and mobile-first design. Launch your
            site in minutes.
          </p>
        </div>
      </div>

      <TemplateSection title={`${name} Templates`} />

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="mb-4 text-xl font-bold">Mobile-Optimized</h3>
              <p className="text-slate-600">
                All our {name.toLowerCase()} templates are designed to look
                stunning on every device.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="mb-4 text-xl font-bold">SEO Ready</h3>
              <p className="text-slate-600">
                Built-in SEO tools help your {name.toLowerCase()} site rank at
                the top of Google results in Nepal.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="mb-4 text-xl font-bold">eSewa & Khalti</h3>
              <p className="text-slate-600">
                Accept payments instantly with native integration for all major
                Nepali payment gateways.
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
