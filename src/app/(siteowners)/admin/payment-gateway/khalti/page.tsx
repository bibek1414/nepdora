import KhaltiPage from "@/components/site-owners/admin/plugins/payment-gateway/khalti";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Khalti Payment Settings",
    pageDescription:
      "Manage Khalti payment gateway settings for {storeName}. Configure, enable, and manage payments securely from the admin dashboard.",
    pageRoute: "/admin/payment-gateway/khalti",
  });
}

import { redirect } from "next/navigation";

export default function KhaltiPaymentPage() {
  redirect("/admin/payments");
}
