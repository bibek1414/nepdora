import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import EditBlogClient from "./edit-blog-client";

interface EditBlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EditBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateAdminPageMetadata({
    pageName: "Edit Blog",
    pageDescription: `Edit your blog post "${slug}" for {storeName}. Update content, images, and SEO settings.`,
    pageRoute: `/admin/blogs/edit/${slug}`,
  });
}

export default function EditBlogPage() {
  return <EditBlogClient />;
}
