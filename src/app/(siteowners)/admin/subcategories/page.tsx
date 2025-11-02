import { SubCategoryList } from "@/components/site-owners/admin/sub-category/sub-category-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Subcategory Management",
    pageDescription:
      "Manage subcategories efficiently for {storeName}. Add, edit, and organize subcategories directly from the admin dashboard.",
    pageRoute: "/admin/sub-categories",
  });
}

export default function SubCategoryManagementPage() {
  return (
    <div className="mx-auto p-5 py-10">
      <SubCategoryList />
    </div>
  );
}
