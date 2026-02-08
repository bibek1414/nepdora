import React from "react";
import { ProductDetail } from "@/components/site-owners/builder/products/product-details";
import { use } from "react";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

// Dynamic metadata for product detail page
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { siteUser, slug } = await params;

  return generatePublishPageMetadata({
    pageName: `Product - ${slug}`,
    pageDescription:
      "Explore {storeName}'s product: {slug}. View detailed information, images, and specifications of this product.",
    pageRoute: `/product/${slug}`,
  });
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, slug } = use(params);

  return <ProductDetail slug={slug} siteUser={siteUser} />;
}
