import { SubscriptionPlansGrid } from "@/components/site-owners/admin/subscription/subscription-plans-grid";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Subscription Settings",
    pageDescription:
      "Manage your subscription settings efficiently. Update your subscription plan directly from the admin dashboard.",
    pageRoute: "/admin/settings/subscription",
  });
}

export default function SubscriptionSettingsPage() {
  return (
    <div className="space-y-8">
      <SubscriptionPlansGrid />
    </div>
  );
}
