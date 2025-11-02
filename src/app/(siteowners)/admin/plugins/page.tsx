import PluginManager from "@/components/site-owners/admin/plugins/plugin-manager";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Plugin Management",
    pageDescription:
      "Manage plugins efficiently in {storeName}. Install, activate, and configure plugins directly from the admin dashboard.",
    pageRoute: "/admin/plugins",
  });
}

export default function PluginManagementPage() {
  return <PluginManager />;
}
