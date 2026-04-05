import { Metadata } from "next";
import { notFound } from "next/navigation";
import Comparison from "@/components/marketing/comparison/comparison";
import { capitalizeWords } from "@/lib/string-utils";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitorSlugs = ALL_COMPETITORS.map(c => `${c.slug}-and-nepdora`);
  if (!competitorSlugs.includes(slug)) {
    notFound();
  }
  const platforms = slug.split("-and-");
  const platform1 = capitalizeWords(platforms[0] || "Shopify");
  const platform2 = capitalizeWords(platforms[1] || "Nepdora");

  const title = `${platform1} vs ${platform2} | Which is better for Nepal?`;
  const description = `Compare ${platform1} and ${platform2}. Discover why Nepdora is the best choice for businesses in Nepal with local payments and support.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    keywords: [
      `${platform1} vs ${platform2}`,
      `${platform1} nepal price`,
      `${platform2} vs ${platform1} features`,
    ],
  });
}

import { JsonLd } from "@/components/shared/json-ld";
import { ALL_COMPETITORS } from "@/constants/competitors";

export async function generateStaticParams() {
  return ALL_COMPETITORS.map(competitor => ({
    slug: `${competitor.slug}-and-nepdora`,
  }));
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const competitorSlugs = ALL_COMPETITORS.map(c => `${c.slug}-and-nepdora`);
  if (!competitorSlugs.includes(slug)) {
    notFound();
  }
  const platforms = slug.split("-and-");
  const platform1 = capitalizeWords(platforms[0] || "");

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${platform1} vs ${SITE_NAME} Comparison`,
    description: `A detailed comparison between ${platform1} and ${SITE_NAME} for businesses in Nepal.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
  };

  return (
    <div className="py-12 md:py-24">
      <JsonLd id="comparison-schema" data={comparisonSchema} />
      <div className="container mx-auto mb-16 px-4 text-center">
        <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
          {platform1} vs Nepdora
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-600">
          Choosing the right platform for your business in Nepal is crucial. See
          how {platform1} compares to Nepdora in features, pricing, and local
          support.
        </p>
      </div>

      <Comparison platformName={platform1} />
    </div>
  );
}
