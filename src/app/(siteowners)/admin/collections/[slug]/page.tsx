import { CollectionDataManagement } from "@/components/site-owners/admin/collections/collection-data-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import { use } from "react";

interface CollectionDataPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionDataPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateAdminPageMetadata({
    pageName: `Collection: ${slug}`,
    pageDescription: `Manage data for the ${slug} collection in {storeName}.`,
    pageRoute: `/admin/collections/${slug}`,
  });
}

export default function CollectionDataPage({
  params,
}: CollectionDataPageProps) {
  const { slug } = use(params);

  return (
    <div className="container mx-auto p-6">
      <CollectionDataManagement slug={slug} />
    </div>
  );
}
