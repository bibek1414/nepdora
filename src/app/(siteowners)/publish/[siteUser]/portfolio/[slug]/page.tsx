"use client";

import React from "react";
import { PortfolioDetail } from "@/components/site-owners/publish/portfolio/portfolio-detail";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, slug } = use(params);

  return <PortfolioDetail slug={slug} siteUser={siteUser} />;
}
