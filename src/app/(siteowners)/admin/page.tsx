import AdminDashboardPage from "@/components/site-owners/admin/dashboard/admin-dashboard";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Dashboard",
    pageDescription:
      "Access and manage your {storeName} dashboard efficiently. View stats, manage settings, and monitor your account all in one place.",
    pageRoute: "/admin/dashboard",
  });
}

import { getServerUser } from "@/hooks/use-jwt-server";

export default async function AdminPage() {
  const user = await getServerUser();
  return <AdminDashboardPage user={user || undefined} />;
}
