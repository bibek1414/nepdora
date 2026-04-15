import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/json-ld";
import { industries, INDUSTRY_LABELS, cities } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ industry: string; city: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  // Static params are currently pre-rendered on-demand or via specific industry logic
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, city } = await params;
  if (
    industry === "templates" ||
    !industries.includes(industry) ||
    !cities.includes(city.toLowerCase())
  ) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  const title = `Best ${industryLabel} in ${cityName} | Launch Your Website Fast | Nepdora`;
  const description = `Need a professional ${industryLabel.toLowerCase()} website in ${cityName}? Nepdora provides localized templates, eSewa/Khalti integration, and expert SEO for the ${cityName} market.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/${industry}/${city}`,
    keywords: [
      `${industry} website ${city}`,
      `${industryLabel} ${cityName}`,
      `website builder ${cityName}`,
    ],
  });
}

export default async function IndustryCityLandingPage({ params }: Props) {
  const { industry, city } = await params;
  if (
    industry === "templates" ||
    !industries.includes(industry) ||
    !cities.includes(city.toLowerCase())
  ) {
    notFound();
  }

  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${industryLabel} in ${cityName} - Nepdora Website Builder`,
    description: `Professional website building solutions for ${industryLabel.toLowerCase()}s in ${cityName}, Nepal.`,
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    provider: {
      "@type": "Organization",
      name: "Nepdora",
      url: absoluteUrl(),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: industryLabel,
        item: absoluteUrl(`/${industry}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: absoluteUrl(`/${industry}/${city}`),
      },
    ],
  };

  return (
    <>
      <JsonLd id="industry-city-schema" data={schema} />
      <JsonLd id="industry-city-breadcrumb" data={breadcrumbSchema} />
      <CitiesLandingPage
        category={industry}
        city={city}
        breadcrumbItems={[
          { label: industryLabel, href: `/${industry}` },
          { label: cityName, href: `/${industry}/${city}` },
        ]}
      />
    </>
  );
}
