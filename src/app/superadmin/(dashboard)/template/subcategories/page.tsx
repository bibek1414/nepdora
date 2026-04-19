import TemplateSubcategoriesClient from "./template-subcategories-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Subcategories | Nepdora Superadmin",
  description: "Organize templates into subcategories for better navigation.",
};

export default function TemplateSubcategoriesPage() {
  return <TemplateSubcategoriesClient />;
}
