import { CollectionsList } from "@/components/site-owners/admin/collections/collections-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Collections Management",
    pageDescription:
      "Create and manage dynamic content collections in {storeName}. Build custom data structures with flexible fields.",
    pageRoute: "/admin/collections",
  });
}

export default function CollectionsPage() {
  return (
    <div className="container mx-auto p-6">
      <CollectionsList />
    </div>
  );
}
