import EsewaPage from "@/components/site-owners/admin/plugins/payment-gateway/esewa";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Esewa Payment Settings",
    pageDescription:
      "Manage Esewa payment gateway settings for {storeName}. Configure, enable, and manage payments securely from the admin dashboard.",
    pageRoute: "/admin/plugins/payment-gateway/esewa",
  });
}

export default function EsewaPaymentPage() {
  return <EsewaPage />;
}
