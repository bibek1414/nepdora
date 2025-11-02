import ServicesManagement from "@/components/site-owners/admin/services/services-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Services Management",
    pageDescription:
      "Manage services offered by {storeName}. Add, edit, and organize your service listings directly from the admin dashboard to keep your offerings up to date.",
    pageRoute: "/admin/services",
  });
}

export default function ServicesManagementPage() {
  return <ServicesManagement />;
}
