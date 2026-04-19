import EditBlogClient from "./edit-blog-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog | Nepdora Superadmin",
  description: "Update platform blog post details.",
};

export default function EditBlogPage() {
  return <EditBlogClient />;
}
