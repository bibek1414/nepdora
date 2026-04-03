import { capitalizeWords } from "@/lib/string-utils";
import { INDUSTRY_CONTENT } from "@/constants/marketing-content";
import { INDUSTRY_LABELS } from "@/lib/seo-data";
import { CityHero } from "./components/city-hero";
import { CityBenefits } from "./components/city-benefits";
import { CityFeatures } from "./components/city-features";
import { CityIndustryLists } from "./components/city-industry-lists";
import { CityResources } from "./components/city-resources";
import { CityFAQ } from "./components/city-faq";
import { CityCTA } from "./components/city-cta";
import { IndustryTemplates } from "./components/industry-templates";
import { IndustryFeaturesGrid } from "./components/industry-features-grid";
import { IndustryPricing } from "./components/industry-pricing";
import { HowItWorks } from "./components/how-it-works";
import { PaymentIntegration } from "./components/payment-integration";
import { ComparisonSection } from "./components/comparison-section";
import { LeadCaptureCRM } from "./components/lead-capture-crm";

interface CitiesLandingPageProps {
  category: string;
  city: string;
}

const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  kathmandu: [
    "Koteshwor",
    "Thamel",
    "Baneshwor",
    "Lainchaur",
    "Balaju",
    "Boudha",
    "Patan",
    "Maharajgunj",
  ],
  pokhara: [
    "Lakeside",
    "New Road",
    "Mahendra Pul",
    "Bagar",
    "Prithvi Chowk",
    "Pardi",
  ],
  lalitpur: [
    "Jhamsikhel",
    "Jawalakhel",
    "Kupondole",
    "Patan",
    "Sanepa",
    "Gwarko",
  ],
  default: [
    "Downtown",
    "Central Market",
    "Business District",
    "Residential Area",
  ],
};

const CITY_INDUSTRIES: Record<string, string[]> = {
  kathmandu: [
    "Tourism",
    "Retail",
    "Education",
    "Healthcare",
    "E-commerce",
    "Agencies",
  ],
  pokhara: [
    "Adventure Sports",
    "Hotels",
    "Cafes",
    "Handicrafts",
    "Travel Guides",
  ],
  default: ["Retail", "Services", "Education", "Consultancy", "Manufacturing"],
};

export const CitiesLandingPage: React.FC<CitiesLandingPageProps> = ({
  category,
  city,
}) => {
  const cityName = capitalizeWords(city);
  const cityLower = city.toLowerCase();
  const industryLabel = INDUSTRY_LABELS[category] || capitalizeWords(category.replace("-", " "));

  const content = INDUSTRY_CONTENT[category] || {
    title: `Best ${industryLabel} in ${cityName}`,
    description: `Launch your professional ${category.toLowerCase()} in ${cityName} with Nepdora. The fastest, AI-powered way to grow your business online in Nepal.`,
    benefits: [
      `Localized SEO for ${cityName} searches`,
      "Mobile-first design for high performance",
      "Integrated Nepalese payment systems",
      "24/7 Local support and onboarding",
    ],
  };

  const neighborhoods =
    CITY_NEIGHBORHOODS[cityLower] || CITY_NEIGHBORHOODS.default;
  const industries = CITY_INDUSTRIES[cityLower] || CITY_INDUSTRIES.default;

  // Handle Dynamic SEO overrides for City Landing Pages
  if (cityLower !== "nepal") {
    const hasWebsiteWord = industryLabel.toLowerCase().includes("website");
    content.customH1 = `Create Your ${industryLabel}${hasWebsiteWord ? "" : " Website"} in ${cityName} Today`;
    
    // Special case for Kathmandu
    if (category === "ecommerce" && cityLower === "kathmandu") {
      content.customH1 = `Create Free E-Commerce Website in Kathmandu (2026)`;
    }
  }

  return (
    <div className="flex flex-col gap-0 overflow-hidden bg-white">
      <CityHero
        cityName={cityName}
        category={category}
        title={content.title}
        description={content.description}
        customH1={content.customH1}
        customIntro={content.customIntro}
        subHeadline={content.subHeadline}
        ctaText={content.ctaText}
      />

      {/* Blueprint Step 1: How it Works (3-Step Guide) */}
      <HowItWorks steps={content.howToSteps || []} category={category} />

      {/* Blueprint Step 2: Niche-Specific Features */}
      <IndustryFeaturesGrid
        features={content.detailedFeatures || []}
        category={category}
        customH2={content.customH2}
      />

      {/* Blueprint Step 3: Lead Capture & CRM (Specific to Agency/B2B) */}
      <LeadCaptureCRM data={content.leadCaptureCRM!} />

      {/* Blueprint Step 4: Local Payment Visibility */}
      <PaymentIntegration />

      {/* Blueprint Step 5: Time & Cost Comparison */}
      <ComparisonSection data={content.comparison!} />

      {/* Blueprint Step 6: Templates */}
      <IndustryTemplates category={category} />

      {/* Blueprint Step 7: Pricing */}
      <div className="py-24 bg-slate-50">
        <IndustryPricing category={category} />
      </div>

      <CityIndustryLists
        cityName={cityName}
        industries={industries}
        neighborhoods={neighborhoods}
      />

      <div className="bg-white py-24">
        <CityResources />
      </div>

      <div className="bg-slate-50 py-24">
        <CityFAQ />
      </div>

      <div className="py-24">
        <CityCTA cityName={cityName} />
      </div>
    </div>
  );
};
