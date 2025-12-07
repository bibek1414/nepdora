import PopupFormList from "@/components/site-owners/admin/popup-inquiries/popup-inquiries-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Popup Inquiries",
    pageDescription:
      "View and manage popup form inquiries for {storeName}. Track, organize, and respond to customer submissions efficiently from the admin dashboard.",
    pageRoute: "/admin/popup-inquiries",
  });
}

export default function PopupInquiriesPage() {
  return <PopupFormList />;
}
