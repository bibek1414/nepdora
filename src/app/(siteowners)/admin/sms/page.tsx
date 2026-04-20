import { SMSManagementClient } from "@/components/site-owners/admin/sms/sms-management-client";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "SMS Management",
    pageDescription:
      "Manage your SMS credits, track usage, and purchase credits for {storeName} efficiently.",
    pageRoute: "/admin/sms",
  });
}

export default function SMSPage() {
  return <SMSManagementClient />;
}
