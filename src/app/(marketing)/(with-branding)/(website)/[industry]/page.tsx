import { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ industry: string }>;
}

export const dynamic = "force-dynamic";

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

  // SEO Blueprint Logic
  const isBooking = [
    "booking",
    "travel",
    "tours",
    "medical",
    "clinic",
    "dental",
    "education",
  ].some(s => industry.toLowerCase().includes(s));
  const action = isBooking ? "Create" : "Build";
  const niche = industryLabel;
  const valueProp = isBooking ? "(Fast Setup)" : "(Start Selling Today)";

  const title = `${action} a ${niche} Website in Nepal ${valueProp} | Nepdora`;
  const description = `Launch your professional ${niche.toLowerCase()} website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from Nepdora.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/${industry}`,
    keywords: [
      `${industry} website Nepal`,
      `${industry} online store Nepal`,
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
        name: "Industries",
        item: absoluteUrl("/industries"),
      },
      {
        "@type": "ListItem",
        position: 3,
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
        city="Nepdora" 
        breadcrumbItems={[
          { label: "Industries", href: "/industries" },
          { label: industryLabel, href: `/${industry}` }
        ]} 
      />
    </>
  );
}
