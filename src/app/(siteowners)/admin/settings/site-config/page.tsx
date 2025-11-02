import { SiteConfigForm } from "@/components/site-owners/admin/site-config/site-config-form";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Site Configuration",
    pageDescription:
      "Manage site settings efficiently for {storeName}. Update your store details, branding, and configuration directly from the admin dashboard.",
    pageRoute: "/admin/site-config",
  });
}

function SiteConfigPage() {
  return (
    <div className="container mx-auto p-6">
      <SiteConfigForm />
    </div>
  );
}

export default SiteConfigPage;
