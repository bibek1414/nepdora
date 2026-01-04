import BlogsManagement from "@/components/super-admin/blogs/blog-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Blog Management",
    pageDescription:
      "Manage Nepdora blog posts. Create, edit, organize, and publish blogs directly from the superadmin dashboard.",
    pageRoute: "/superadmin/blogs",
  });
}

export default function BlogsManagementPage() {
  return <BlogsManagement />;
}
