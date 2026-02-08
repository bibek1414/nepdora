import { CollectionsPage } from "@/components/site-owners/builder/collections/collections-page";
import { use } from "react";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

interface CollectionsProps {
  params: Promise<{ siteUser: string }>;
}

// Dynamic metadata per store/subdomain
export async function generateMetadata({
  params,
}: CollectionsProps): Promise<Metadata> {
  const { siteUser } = await params;

  return generatePublishPageMetadata({
    pageName: "Collections",
    pageDescription:
      "Explore {storeName}'s collections. Discover carefully curated premium products and shop with ease.",
    pageRoute: `/collections`,
  });
}

export default function Collections({ params }: CollectionsProps) {
  const { siteUser } = use(params);

  return (
    <CollectionsPage
      siteUser={siteUser}
      title="Our Collections"
      subtitle="Discover our carefully curated selection of premium products"
    />
  );
}
