import React from "react";
import { PortfolioDetail } from "@/components/site-owners/publish/portfolio/portfolio-detail";
import { use } from "react";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

// Dynamic metadata for portfolio detail
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { siteUser, slug } = await params;

  return generatePublishPageMetadata({
    pageName: `Portfolio - ${slug}`,
    pageDescription:
      "Explore the {storeName} portfolio project: {slug}. View details, images, and project information dynamically.",
    pageRoute: `/portfolio/${slug}`,
  });
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, slug } = use(params);

  return <PortfolioDetail slug={slug} siteUser={siteUser} />;
}
