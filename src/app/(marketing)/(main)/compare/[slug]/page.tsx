import { Metadata } from "next";
import Comparison from "@/components/marketing/comparison/comparison";
import { capitalizeWords } from "@/lib/string-utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const platforms = slug.split("-and-");
  const platform1 = capitalizeWords(platforms[0] || "Shopify");
  const platform2 = capitalizeWords(platforms[1] || "Nepdora");

  const title = `${platform1} vs ${platform2} | Which is better for Nepal?`;
  const description = `Compare ${platform1} and ${platform2}. Discover why Nepdora is the best choice for businesses in Nepal with local payments and support.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.nepdora.com/compare/${slug}`,
    },
  };
}

import { ALL_COMPETITORS } from "@/constants/competitors";

export async function generateStaticParams() {
  return ALL_COMPETITORS.map(competitor => ({
    slug: `${competitor.slug}-and-nepdora`,
  }));
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const platforms = slug.split("-and-");
  const platform1 = capitalizeWords(platforms[0] || "");

  return (
    <div className="py-12 md:py-24">
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
