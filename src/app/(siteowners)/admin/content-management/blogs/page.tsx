import BlogsManagement from "@/components/site-owners/admin/blogs/blog-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Blog Management",
    pageDescription:
      "Manage your {storeName} blog posts efficiently. Create, edit, organize, and publish blogs directly from the admin dashboard.",
    pageRoute: "/admin/blogs",
  });
}

export default function BlogsManagementPage() {
  return <BlogsManagement />;
}
