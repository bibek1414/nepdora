import React from "react";
import { Metadata } from "next";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import DynamicPageClient from "../[...pageSlug]/dynamic-page-client";

interface PageProps {
  params: Promise<{
    siteUser: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { siteUser } = await params;

  return generatePublishPageMetadata({
    pageName: "Checkout",
    pageDescription: `Secure checkout page for ${siteUser}.`,
    pageRoute: `/${siteUser}/checkout`,
  });
}

export default async function Checkout({ params }: PageProps) {
  const { siteUser } = await params;

  return (
    <DynamicPageClient siteUser={siteUser} currentPageSlug="checkout-draft" />
  );
}
