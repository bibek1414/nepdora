"use client";

import React from "react";
import { BlogDetail } from "@/components/site-owners/publish/blog/blog-details";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { siteUser, slug } = use(params);

  return <BlogDetail slug={slug} siteUser={siteUser} />;
}
