import { SiteConfigForm } from "@/components/site-owners/admin/settings/site-config/site-config-form";
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
    <div className="mx-auto">
      <SiteConfigForm />
    </div>
  );
}

export default SiteConfigPage;
