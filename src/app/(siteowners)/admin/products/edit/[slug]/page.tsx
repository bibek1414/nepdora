import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import EditProductClient from "./edit-product-client";
import { use } from "react";

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateAdminPageMetadata({
    pageName: "Edit Product",
    pageDescription: `Edit your product "${slug}" for {storeName}. Update pricing, inventory, descriptions, and SEO.`,
    pageRoute: `/admin/products/edit/${slug}`,
  });
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = use(params);
  return <EditProductClient slug={slug} />;
}
