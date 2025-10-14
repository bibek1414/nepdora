"use client";

import React from "react";
import { ServiceDetail } from "@/components/site-owners/publish/services/services-details";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, slug } = use(params);

  return <ServiceDetail slug={slug} siteUser={siteUser} />;
}
