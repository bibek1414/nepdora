import { CollectionsPage } from "@/components/site-owners/builder/collections/collections-page";
import { use } from "react";

interface CollectionsProps {
  params: Promise<{ siteUser: string }>;
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
