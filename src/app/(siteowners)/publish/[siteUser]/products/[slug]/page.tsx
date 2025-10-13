"use client";

import React from "react";
import { ProductDetail } from "@/components/site-owners/builder/products/product-details";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, slug } = use(params);

  return <ProductDetail slug={slug} siteUser={siteUser} />;
}
