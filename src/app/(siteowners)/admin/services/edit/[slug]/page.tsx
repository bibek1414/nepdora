import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import EditServiceClient from "./edit-service-client";

interface EditServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EditServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateAdminPageMetadata({
    pageName: "Edit Service",
    pageDescription: `Edit your service "${slug}" for {storeName}. Update service details, images, and SEO settings.`,
    pageRoute: `/admin/services/edit/${slug}`,
  });
}

export default function EditServicePage() {
  return <EditServiceClient />;
}
