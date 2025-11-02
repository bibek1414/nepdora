import OrdersPage from "@/components/site-owners/admin/orders/order-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Orders Management",
    pageDescription:
      "Manage orders efficiently in {storeName}. View, update, and track all customer orders directly from the admin dashboard.",
    pageRoute: "/admin/orders",
  });
}

export default function OrdersManagementPage() {
  return <OrdersPage />;
}
