"use client";

import React from "react";
import { ProductDetail } from "@/components/site-owners/products/product-details";
import { PreviewLayout } from "@/components/preview-layout";
import { use } from "react";
interface ProductPageProps {
  params: Promise<{ siteUser: string; id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser } = use(params);
  const { id } = use(params);
  return (
    <PreviewLayout
      siteUser={siteUser}
      title="Product Preview"
      showBackToPreview={true}
    >
      <ProductDetail productId={id} siteId={siteUser} />
    </PreviewLayout>
  );
}
