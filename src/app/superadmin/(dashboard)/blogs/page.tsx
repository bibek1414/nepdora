import BlogsManagement from "@/components/super-admin/blogs/blog-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Management | Nepdora Superadmin",
  description: "Create, edit, and publish platform-wide blog posts.",
};

export default function BlogsManagementPage() {
  return <BlogsManagement />;
}
