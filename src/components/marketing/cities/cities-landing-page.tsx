import { capitalizeWords } from "@/lib/string-utils";
import { INDUSTRY_CONTENT } from "@/constants/marketing-content";
import { INDUSTRY_LABELS } from "@/lib/seo-data";
import { CityHero } from "./components/city-hero";
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
import { IndustryDiscovery } from "./components/industry-discovery";
import { CityDiscovery } from "./components/city-discovery";

interface CitiesLandingPageProps {
  category: string;
  city: string;
  breadcrumbItems?: { label: string; href: string }[];
}

export const CitiesLandingPage: React.FC<CitiesLandingPageProps> = ({
  category,
  city,
  breadcrumbItems: manualBreadcrumbItems,
}) => {
  const cityName = capitalizeWords(city);
  const cityLower = city.toLowerCase();
  const industryLabel =
    INDUSTRY_LABELS[category] || capitalizeWords(category.replace("-", " "));

  const content = INDUSTRY_CONTENT[category] || {
    title: `Best ${industryLabel} in ${cityName}`,
    description: `Launch your professional ${category.toLowerCase()} in ${cityName} with Nepdora. The fastest, AI-powered way to grow your business online in Nepal.`,
    benefits: [
      `Localised SEO for ${cityName} searches`,
      "Mobile-first design for high performance",
      "Integrated Nepalese payment systems",
      "24/7 local support and onboarding",
    ],
  };

  if (cityLower !== "nepal" && cityLower !== "nepdora") {
    const hasWebsiteWord = industryLabel.toLowerCase().includes("website");
    content.customH1 = `Create your ${industryLabel}${
      hasWebsiteWord ? "" : " website"
    } in ${cityName} today`;

    if (category === "ecommerce" && cityLower === "kathmandu") {
      content.customH1 = `Create a free e-commerce website in Kathmandu (2026)`;
    }
  } else if (cityLower === "nepdora") {
    const hasWebsiteWord = industryLabel.toLowerCase().includes("website");
    content.customH1 = `Create your ${industryLabel}${
      hasWebsiteWord ? "" : " website"
    } in Nepdora`;
  }

  const defaultBreadcrumbItems = [
    {
      label: industryLabel.includes("Store")
        ? industryLabel.replace(" Store", "")
        : industryLabel,
      href: `/create-${category}-website-in-nepdora`,
    },
  ];

  if (cityLower !== "nepal" && cityLower !== "nepdora") {
    defaultBreadcrumbItems.push({
      label: cityName,
      href: `/create-${category}-website-in-nepdora/${cityLower}`,
    });
  }

  const breadcrumbsToRender = manualBreadcrumbItems || defaultBreadcrumbItems;

  return (
    <main className="bg-white">
      <CityHero
        cityName={cityName}
        category={category}
        title={content.title}
        description={content.description}
        customH1={content.customH1}
        customIntro={content.customIntro}
        subHeadline={content.subHeadline}
        ctaText={content.ctaText}
        breadcrumbItems={breadcrumbsToRender}
      />

      <HowItWorks steps={content.howToSteps || []} category={category} />

      <IndustryFeaturesGrid
        features={content.detailedFeatures || []}
        category={category}
        customH2={content.customH2}
      />

      <LeadCaptureCRM data={content.leadCaptureCRM!} />

      <PaymentIntegration />

      <ComparisonSection data={content.comparison!} />

      <IndustryTemplates category={category} />

      <IndustryPricing category={category} />

      <CityResources />

      <CityFAQ />

      <CityDiscovery currentCity={city} category={category} />

      <IndustryDiscovery currentCategory={category} />

      <CityCTA cityName={cityName} category={category} />
    </main>
  );
};
