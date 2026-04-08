import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import AddProductClient from "./add-product-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Add New Product",
    pageDescription:
      "List a new product in your store {storeName}. Define product details, pricing, inventory, and images.",
    pageRoute: "/admin/products/add",
  });
}

export default function AddProductPage() {
  return <AddProductClient />;
}
