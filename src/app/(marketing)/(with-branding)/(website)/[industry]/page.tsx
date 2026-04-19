import { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ industry: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return industries.map(industry => ({ industry }));
}

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  if (industry === "templates" || !industries.includes(industry)) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);

  const title = `Create ${industryLabel} Website in Nepal | Nepdora`;
  const description = `Launch your professional ${industryLabel.toLowerCase()} website in Nepal in under 10 minutes. Integrated payments (eSewa, Khalti), local support, and easy-to-use tools from Nepdora.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/${industry}`,
    keywords: [
      `${industryLabel} website Nepal`,
      `${industryLabel} online store Nepal`,
      `create ${industryLabel.toLowerCase()} website`,
      `Nepdora ${industry}`,
    ],
  });
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;
  if (industry === "templates" || !industries.includes(industry)) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Nepdora ${industryLabel} Website Builder`,
    description: `Professional website building solutions for ${industryLabel.toLowerCase()}s in Nepal.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
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
    ],
  };

  return (
    <>
      <JsonLd id="industry-schema" data={schema} />
      <JsonLd id="industry-breadcrumb" data={breadcrumbSchema} />
      <CitiesLandingPage
        category={industry}
        city="Nepal"
        breadcrumbItems={[{ label: industryLabel, href: `/${industry}` }]}
      />
    </>
  );
}
