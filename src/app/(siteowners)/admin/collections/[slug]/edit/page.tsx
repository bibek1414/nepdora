import { EditCollectionForm } from "@/components/site-owners/admin/collections/edit-collection-form";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import { use } from "react";

interface EditCollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EditCollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateAdminPageMetadata({
    pageName: `Edit Collection: ${slug}`,
    pageDescription: `Edit the structure and fields of the ${slug} collection.`,
    pageRoute: `/admin/collections/${slug}/edit`,
  });
}

export default function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { slug } = use(params);
  return (
    <div className="container mx-auto p-6">
      <EditCollectionForm slug={slug} />
    </div>
  );
}
