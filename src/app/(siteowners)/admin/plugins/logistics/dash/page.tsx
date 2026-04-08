import DashPage from "@/components/site-owners/admin/plugins/logistics/dash";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Logistics Dashboard",
    pageDescription:
      "Overview of your logistics and shipping operations for {storeName}. Monitor delivery statuses and performance.",
    pageRoute: "/admin/plugins/logistics/dash",
  });
}

export default function Dash() {
  return <DashPage />;
}
