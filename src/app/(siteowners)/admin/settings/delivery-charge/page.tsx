import DeliveryChargesList from "@/components/site-owners/admin/settings/delivery-charge/delivery-charge";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Delivery Charges Management",
    pageDescription:
      "Manage delivery charges efficiently for {storeName}. Add, edit, and organize shipping costs directly from the admin dashboard.",
    pageRoute: "/admin/settings/delivery-charges",
  });
}

export default function DeliveryChargesPage() {
  return <DeliveryChargesList />;
}
