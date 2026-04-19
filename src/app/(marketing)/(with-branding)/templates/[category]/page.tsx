import { Metadata } from "next";
import { notFound } from "next/navigation";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { TemplateSection } from "@/components/marketing/templates/template-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { TemplateCategoryHero } from "@/components/marketing/templates/template-category-hero";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_DATA,
} from "@/constants/templates";
export const revalidate = 86400; // Cache for 1 hour

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return TEMPLATE_CATEGORIES.map(category => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const category = rawCategory.toLowerCase();

  if (!TEMPLATE_CATEGORIES.includes(category)) {
    notFound();
  }

  const name = capitalizeWords(category);

  const title = `${name} Website Templates in Nepal (Free & Premium) | Nepdora`;

  const description = `Explore ${name.toLowerCase()} website templates in Nepal. Choose from free and premium designs, fully customizable, mobile-friendly, and ready to launch with eSewa & Khalti support.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/templates/${category}`,
    keywords: [
      `${category} website templates Nepal`,
      `${category} website design Nepal`,
      `best ${category} templates Nepal`,
      `free ${category} website templates`,
      `${category} website builder Nepal`,
    ],
  });
}

// Helper to get category display name
const getCategoryDisplayName = (category: string): string => {
  return TEMPLATE_CATEGORY_DATA[category]?.name || capitalizeWords(category);
};

// Helper to get category description
const getCategoryDescription = (category: string): string => {
  return (
    TEMPLATE_CATEGORY_DATA[category]?.description ||
    `Browse our collection of professional ${getCategoryDisplayName(
      category
    ).toLowerCase()} website templates designed for Nepali businesses.`
  );
};

export default async function TemplateCategoryPage({ params }: Props) {
  const { category: rawCategory } = await params;
  const category = rawCategory.toLowerCase();

  if (!TEMPLATE_CATEGORIES.includes(category)) {
    notFound();
  }

  const displayName = getCategoryDisplayName(category);
  const categorySlug=TEMPLATE_CATEGORY_DATA[category].slug;
  const description = getCategoryDescription(category);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayName} Website Templates`,
    description: `Professionally designed website templates for ${displayName} businesses in Nepal.`,
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="template-coll-schema" data={schema} />

      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs
          items={[
            { label: "Templates", href: "/templates" },
            { label: displayName, href: `/templates/${category}` },
          ]}
        />
        <TemplateCategoryHero
          categoryName={displayName}
          categorySlug={categorySlug}
          categoryDescription={description}
        />
      </div>

      {/* Templates Grid - Passing category filter */}
      <div className="container mx-auto max-w-6xl px-6">
        <TemplateSection
          title={`${displayName} Templates`}
          description={`Browse our collection of ${displayName.toLowerCase()} templates`}
          pageSize={12}
        />
      </div>

      <FAQSection />
      <CTASection category={category} />
    </main>
  );
}
