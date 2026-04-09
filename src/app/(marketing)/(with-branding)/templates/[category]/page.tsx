import { Metadata } from "next";
import { notFound } from "next/navigation";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { TemplateSection } from "@/components/marketing/templates/template-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = true;

const TEMPLATE_CATEGORIES = [
  "restaurant",
  "restaurant-website",
  "ecommerce",
  "ecommerce-website",
  "portfolio",
  "agency",
  "grocery-store",
  "agency-website",
  "business",
  "educational",
  "educational-consultancy",
  "travel",
  "portfolio-cv-website",
  "travel-agency",
  "grocery",
  "grocery-website",
  "medical",
  "medical-clinic",
  "clinic",
  "clothing-store",
  "gym",
  "school",
  "real-estate",
  "salon",
  "booking-website",
];

export async function generateStaticParams() {
  return TEMPLATE_CATEGORIES.map(category => ({ category }));
}

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const category = rawCategory.toLowerCase();

  if (!TEMPLATE_CATEGORIES.includes(category)) {
    notFound();
  }
  const name = capitalizeWords(category);
  const title = `Best ${name} Website Templates for Nepal | Ready to Use`;
  const description = `Browse free and premium ${name} templates designed for the Nepali market. Mobile-friendly, fast, and integrated with eSewa & Khalti.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/templates/${category}`,
    keywords: [
      `${category} website templates nepal`,
      `${category} website design nepal`,
    ],
  });
}

import { CategoryHero } from "@/components/marketing/templates/category-hero";

export default async function TemplateCategoryPage({ params }: Props) {
  const { category: rawCategory } = await params;
  const category = rawCategory.toLowerCase();

  if (!TEMPLATE_CATEGORIES.includes(category)) {
    notFound();
  }
  const name = capitalizeWords(category);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} Website Templates`,
    description: `Professionally designed website templates for ${name} businesses in Nepal.`,
  };

  return (
    <main className="">
      <JsonLd id="template-coll-schema" data={schema} />
      <CategoryHero categoryName={name} />

      <div className="mx-auto max-w-6xl px-4">
        <TemplateSection title="Selected Templates" />
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
