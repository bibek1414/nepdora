import React from "react";
import { Metadata } from "next";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import DynamicPageClient from "../../[...pageSlug]/dynamic-page-client";

interface PageProps {
  params: Promise<{
    siteUser: string;
    orderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { siteUser, orderId } = await params;

  return generatePublishPageMetadata({
    pageName: `Order Confirmation #${orderId}`,
    pageDescription: `Order confirmation page for ${siteUser}, order #${orderId}.`,
    pageRoute: `/${siteUser}/order-confirmation/${orderId}`,
  });
}

export default async function OrderConfirmation({ params }: PageProps) {
  const { siteUser } = await params;

  return (
    <DynamicPageClient
      siteUser={siteUser}
      currentPageSlug="order-confirmation-draft"
    />
  );
}
