import FacebookPagesManagement from "@/components/site-owners/admin/facebook/facebook-page-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import { getFacebookIntegrations } from "@/lib/actions/facebook-actions";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Facebook Page Management",
    pageDescription:
      "Manage and connect your Facebook pages with {storeName}. Control integrations, sync updates, and handle messages directly from the admin dashboard.",
    pageRoute: "/admin/facebook",
  });
}

export default async function FacebookPage() {
  const pages = await getFacebookIntegrations();

  return (
    <div className="container mx-auto px-4 py-8">
      <FacebookPagesManagement initialPages={pages || []} />
    </div>
  );
}
