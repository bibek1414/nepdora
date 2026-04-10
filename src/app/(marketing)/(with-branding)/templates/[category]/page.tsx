import { Metadata } from "next";
import { notFound } from "next/navigation";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { TemplateSection } from "@/components/marketing/templates/template-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";

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

// Helper to get category display name
const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    restaurant: "Restaurant",
    "restaurant-website": "Restaurant",
    ecommerce: "E-commerce",
    "ecommerce-website": "E-commerce",
    portfolio: "Portfolio",
    agency: "Agency",
    "agency-website": "Agency",
    business: "Business",
    educational: "Educational",
    "educational-consultancy": "Educational Consultancy",
    travel: "Travel",
    "travel-agency": "Travel Agency",
    "portfolio-cv-website": "Portfolio & CV",
    grocery: "Grocery",
    "grocery-store": "Grocery Store",
    "grocery-website": "Grocery",
    medical: "Medical",
    "medical-clinic": "Medical Clinic",
    clinic: "Clinic",
    "clothing-store": "Clothing Store",
    gym: "Gym & Fitness",
    school: "School",
    "real-estate": "Real Estate",
    salon: "Salon & Spa",
    "booking-website": "Booking",
  };
  return displayNames[category] || capitalizeWords(category);
};

// Helper to get category description
const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    restaurant:
      "Showcase your menu, accept online orders, and manage reservations with our beautiful restaurant templates.",
    "restaurant-website":
      "Showcase your menu, accept online orders, and manage reservations with our beautiful restaurant templates.",
    ecommerce:
      "Launch your online store with built-in eSewa and Khalti payments, inventory management, and more.",
    "ecommerce-website":
      "Launch your online store with built-in eSewa and Khalti payments, inventory management, and more.",
    portfolio:
      "Showcase your work beautifully with our portfolio templates designed for creatives and professionals.",
    agency:
      "Build trust and showcase your services with agency templates that convert visitors into clients.",
    business:
      "Professional business websites that establish credibility and drive growth.",
    educational:
      "Connect with students and parents through professional educational institution websites.",
    travel:
      "Inspire travelers and book tours with stunning travel agency templates.",
    medical:
      "Provide a professional online presence for your medical practice or clinic.",
    gym: "Attract new members and showcase your fitness programs with gym website templates.",
    school: "Engage parents and students with modern school website designs.",
    "real-estate":
      "Showcase properties and attract buyers with real estate website templates.",
    salon:
      "Book appointments and showcase your beauty services with salon templates.",
  };
  return (
    descriptions[category] ||
    `Browse our collection of professional ${getCategoryDisplayName(category).toLowerCase()} website templates designed for Nepali businesses.`
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
                href="/create-website"
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
      <CTASection />
    </main>
  );
}
