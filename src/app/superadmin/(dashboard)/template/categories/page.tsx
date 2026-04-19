import TemplateCategoriesClient from "./template-categories-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Categories | Nepdora Superadmin",
  description: "Manage industry-specific template categories.",
};

export default function TemplateCategoriesPage() {
  return <TemplateCategoriesClient />;
}
