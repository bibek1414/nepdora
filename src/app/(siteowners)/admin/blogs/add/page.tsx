import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import AddBlogClient from "./add-blog-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Add New Blog",
    pageDescription:
      "Create and publish a new blog post for {storeName}. Share updates, news, and stories with your customers.",
    pageRoute: "/admin/blogs/add",
  });
}

export default function AddBlogPage() {
  return <AddBlogClient />;
}
