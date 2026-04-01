import { capitalizeWords } from "@/lib/string-utils";
import { INDUSTRY_CONTENT } from "@/constants/marketing-content";
import { CityHero } from "./components/city-hero";
import { CityBenefits } from "./components/city-benefits";
import { CityFeatures } from "./components/city-features";
import { CityIndustryLists } from "./components/city-industry-lists";
import { CityResources } from "./components/city-resources";
import { CityFAQ } from "./components/city-faq";
import { CityCTA } from "./components/city-cta";

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

const INDUSTRY_SPECIFIC_HIGHLIGHTS: Record<
  string,
  { title: string; desc: string; icon: string }[]
> = {
  restaurant: [
    { title: "QR Digital Menu", desc: "No more paper menus.", icon: "🍽️" },
    { title: "Online Reservations", desc: "Manage bookings.", icon: "📅" },
    { title: "Food Delivery Ready", desc: "Integration ready.", icon: "🛵" },
  ],
  ecommerce: [
    { title: "eSewa Integration", desc: "Accept payments.", icon: "💳" },
    { title: "Inventory Sync", desc: "Real-time stock.", icon: "📦" },
    { title: "Automated Shipping", desc: "Track packages.", icon: "🚚" },
  ],
  default: [
    { title: "AI Site Wizard", desc: "Launch in minutes.", icon: "⚡" },
    { title: "Local SEO Ready", desc: "Rank for searches.", icon: "🔍" },
    {
      title: "Mobile First",
      desc: "Looks amazing on every phone.",
      icon: "📱",
    },
  ],
};

export const CitiesLandingPage: React.FC<CitiesLandingPageProps> = ({
  category,
  city,
}) => {
  const cityName = capitalizeWords(city);
  const cityLower = city.toLowerCase();

  const content = INDUSTRY_CONTENT[category] || {
    title: `Best ${capitalizeWords(category.replace("-", " "))} in ${cityName}`,
    description: `Launch your professional ${category.toLowerCase()} in ${cityName} with Nepdora. The fastest, AI-powered way to grow your business online in Nepal.`,
    benefits: [
      `Localized SEO for ${cityName} searches`,
      "Mobile-first design for high performance",
      "Integrated Nepalese payment systems",
      "24/7 Local support and onboarding",
    ],
  };

  const dynamicHighlights =
    INDUSTRY_SPECIFIC_HIGHLIGHTS[category] ||
    INDUSTRY_SPECIFIC_HIGHLIGHTS.default;

  const neighborhoods =
    CITY_NEIGHBORHOODS[cityLower] || CITY_NEIGHBORHOODS.default;
  const industries = CITY_INDUSTRIES[cityLower] || CITY_INDUSTRIES.default;

  return (
    <div className="flex flex-col">
      <CityHero
        cityName={cityName}
        category={category}
        title={content.title}
        description={content.description}
      />

      <CityBenefits
        cityName={cityName}
        category={category}
        highlights={dynamicHighlights}
      />

      <CityFeatures
        cityName={cityName}
        category={category}
        benefits={content.benefits}
      />

      <CityIndustryLists
        cityName={cityName}
        industries={industries}
        neighborhoods={neighborhoods}
      />

      <CityResources />

      <CityFAQ />

      <CityCTA cityName={cityName} />
    </div>
  );
};
