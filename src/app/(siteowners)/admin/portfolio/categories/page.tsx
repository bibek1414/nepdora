import CategoryManagement from "@/components/site-owners/admin/portfolio/category-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Manage Portfolio Categories",
    pageDescription: "Manage and organize your portfolio categories.",
    pageRoute: "/admin/portfolio/categories",
  });
}

export default function CategoryManagementPage() {
  return <CategoryManagement />;
}
