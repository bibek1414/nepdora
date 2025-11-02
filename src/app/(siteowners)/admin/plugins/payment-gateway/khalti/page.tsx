import KhaltiPage from "@/components/site-owners/admin/plugins/payment-gateway/khalti";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Khalti Payment Settings",
    pageDescription:
      "Manage Khalti payment gateway settings for {storeName}. Configure, enable, and manage payments securely from the admin dashboard.",
    pageRoute: "/admin/plugins/payment-gateway/khalti",
  });
}

export default function KhaltiPaymentPage() {
  return <KhaltiPage />;
}
