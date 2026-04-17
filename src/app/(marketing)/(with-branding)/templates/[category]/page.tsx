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
export const revalidate = 86400; // Cache for 1 hour

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = true;

const TEMPLATE_CATEGORIES = [
  "restaurant-website",
  "ecommerce-store",
  "ecommerce",
  "restaurant",
  "clothing-brand",
  "school-college",
  "medical-clinic",
  "travel-agency",
  "gym-fitness",
  "real-estate",
  "beauty-salon",
  "grocery-store",
  "educational-consultancy",
  "digital-agency",
  "portfolio",
  "business",
];

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
  const displayNames: Record<string, string> = {
    "restaurant-website": "Restaurant & Cafe",
    "ecommerce-store": "Ecommerce Store",
    "clothing-brand": "Clothing Brand",
    "school-college": "School & College",
    "medical-clinic": "Medical Clinic",
    "travel-agency": "Travel Agency",
    "gym-fitness": "Gym & Fitness",
    "real-estate": "Real Estate",
    "beauty-salon": "Beauty Salon",
    "grocery-store": "Grocery Store",
    "educational-consultancy": "Educational Consultancy",
    "digital-agency": "Digital Agency",
    portfolio: "Portfolio",
    business: "Business",
  };
  return displayNames[category] || capitalizeWords(category);
};

// Helper to get category description
const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    "restaurant-website":
      "Showcase your menu, accept online orders, and manage reservations with our beautiful restaurant templates.",
    "ecommerce-store":
      "Launch your online store with built-in eSewa and Khalti payments, inventory management, and more.",
    "clothing-brand":
      "Showcase your latest collections and manage size/color variants with fashion-forward templates.",
    "school-college":
      "Connect with students and parents through professional educational institution websites.",
    "medical-clinic":
      "Provide a professional online presence for your medical practice or clinic.",
    "travel-agency":
      "Inspire travelers and book tours with stunning travel agency templates.",
    "gym-fitness":
      "Attract new members and showcase your fitness programs with gym website templates.",
    "real-estate":
      "Showcase properties and attract buyers with real estate website templates.",
    "beauty-salon":
      "Book appointments and showcase your beauty services with salon templates.",
    "grocery-store":
      "Optimized retail layouts for neighborhood grocery stores and marts.",
    "educational-consultancy":
      "High-trust layouts for study abroad and educational consultancies.",
    "digital-agency":
      "Build trust and showcase your services with agency templates that convert visitors into clients.",
    portfolio:
      "Showcase your work beautifully with our portfolio templates designed for creatives and professionals.",
    business:
      "Professional business websites that establish credibility and drive growth.",
  };
  return (
    descriptions[category] ||
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
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              Template Library
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {displayName} Website Templates
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/admin/signup"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Start Building
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                All Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

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
