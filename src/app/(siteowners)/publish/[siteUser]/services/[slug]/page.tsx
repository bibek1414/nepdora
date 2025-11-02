import React from "react";
import { ServiceDetail } from "@/components/site-owners/publish/services/services-details";
import { use } from "react";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

interface ServicePageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}

// Dynamic metadata for service detail page
export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { siteUser, slug } = await params;

  return generatePublishPageMetadata({
    pageName: `Service - ${slug}`,
    pageDescription:
      "Explore {storeName}'s service: {slug}. Learn about features, details, and benefits of this service.",
    pageRoute: `/services/${slug}`,
  });
}

export default function ServicePage({ params }: ServicePageProps) {
  const { siteUser, slug } = use(params);

  return <ServiceDetail slug={slug} siteUser={siteUser} />;
}
