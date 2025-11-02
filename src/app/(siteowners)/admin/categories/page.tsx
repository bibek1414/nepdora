import { CategoryList } from "@/components/site-owners/admin/category/category-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Category Management",
    pageDescription:
      "Manage product categories efficiently in {storeName}. Add, edit, and organize categories to keep your store or website structured and up to date.",
    pageRoute: "/admin/categories",
  });
}

export default function CategoryManagementPage() {
  return (
    <div className="mx-auto p-5 py-10">
      <CategoryList />
    </div>
  );
}
