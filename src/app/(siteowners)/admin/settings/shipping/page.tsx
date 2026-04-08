import ShippingList from "@/components/site-owners/admin/settings/shipping/shipping-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Shipping Settings",
    pageDescription:
      "Configure shipping methods and zones for {storeName}. Manage delivery options and shipping rates.",
    pageRoute: "/admin/settings/shipping",
  });
}

export default function ShippingPage() {
  return <ShippingList />;
}
