import BannerManagement from "@/components/site-owners/admin/banners/banner-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Banner Management",
    pageDescription:
      "Manage and customize banners for your {storeName} site. Add, edit, and organize banners efficiently from the admin dashboard.",
    pageRoute: "/admin/banners",
  });
}

export default function BannerManagementPage() {
  return <BannerManagement />;
}
