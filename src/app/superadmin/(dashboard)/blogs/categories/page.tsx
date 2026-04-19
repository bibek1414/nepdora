import CategoriesClient from "./categories-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Categories | Nepdora Superadmin",
  description: "Organize and manage categories for platform blogs.",
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
