import AddBlogClient from "./add-blog-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Blog | Nepdora Superadmin",
  description: "Create a new platform-wide blog post.",
};

export default function AddBlogPage() {
  return <AddBlogClient />;
}
