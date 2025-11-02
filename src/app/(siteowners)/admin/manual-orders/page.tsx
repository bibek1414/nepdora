import { ManualOrderList } from "@/components/site-owners/admin/manual-order/manual-order-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Manual Orders",
    pageDescription:
      "Manage manual orders efficiently in {storeName}. Create, edit, and track orders directly from the admin dashboard.",
    pageRoute: "/admin/manual-orders",
  });
}

export default function ManualOrdersPage() {
  return <ManualOrderList />;
}
