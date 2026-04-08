import BillingList from "@/components/site-owners/admin/settings/billing/billing-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Billing Settings",
    pageDescription:
      "Manage billing and payment settings for {storeName}. Configure payment gateways and billing addresses.",
    pageRoute: "/admin/settings/billing",
  });
}

export default function Page() {
  return <BillingList />;
}
