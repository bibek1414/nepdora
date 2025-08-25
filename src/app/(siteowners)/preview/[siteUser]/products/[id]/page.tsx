"use client";

import React from "react";
import { ProductDetail } from "@/components/site-owners/products/product-details";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ siteUser: string; id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, id } = use(params);

  return <ProductDetail productId={id} siteId={siteUser} />;
}
