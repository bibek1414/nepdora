import YDMPage from "@/components/site-owners/admin/plugins/logistics/ydm";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "YDM Logistics",
    pageDescription:
      "Manage YDM Logistics integration for {storeName}. Process shipments and track deliveries efficiently.",
    pageRoute: "/admin/plugins/logistics/ydm",
  });
}

export default function YDM() {
  return <YDMPage />;
}
