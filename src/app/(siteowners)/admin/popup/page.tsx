import PopupListPage from "@/components/site-owners/admin/popups/popup-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Popup Management",
    pageDescription:
      "Manage popups for {storeName}. Create, edit, and organize promotional or informational popups directly from the admin dashboard.",
    pageRoute: "/admin/popups",
  });
}

export default function PopupManagementPage() {
  return <PopupListPage />;
}
