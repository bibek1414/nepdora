import FacebookPagesManagement from "@/components/site-owners/admin/facebook/facebook-page-management";
import { FacebookToastHandler } from "@/components/site-owners/admin/facebook/facebook-toast-handler";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import { getFacebookIntegrations } from "@/lib/actions/facebook-actions";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { Suspense } from "react";
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
    <FacebookProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Toast handler must be wrapped in Suspense since it uses useSearchParams */}
        <Suspense fallback={null}>
          <FacebookToastHandler />
        </Suspense>
        <FacebookPagesManagement initialPages={pages || []} />
      </div>
    </FacebookProvider>
  );
}
