import { Metadata } from "next";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { JsonLd } from "@/components/shared/json-ld";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return industries.map(industry => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const title = `Best ${industryLabel} Website Builder in Nepal | Nepdora`;
  const description = `Build a professional ${industryLabel.toLowerCase()} website in Nepal. Integrated payments, local support, and easy-to-use tools from Nepdora.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.nepdora.com/${industry}`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Nepdora ${industryLabel} Website Builder`,
    description: `Professional website building solutions for ${industryLabel.toLowerCase()}s in Nepal.`,
    provider: {
      "@type": "Organization",
      name: "Nepdora",
      url: "https://www.nepdora.com",
    },
  };

  return (
    <>
      <JsonLd id="industry-schema" data={schema} />
      <CitiesLandingPage category={industry} city="nepal" />
    </>
  );
}
