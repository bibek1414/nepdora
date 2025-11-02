import { ProductList } from "@/components/site-owners/admin/products/product-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Product Management",
    pageDescription:
      "Manage products efficiently for {storeName}. Add, edit, and organize products with images, pricing, and categories directly from the admin dashboard.",
    pageRoute: "/admin/products",
  });
}

export default function ProductManagementPage() {
  return (
    <div className="mx-auto p-5 py-10">
      <ProductList />
    </div>
  );
}
