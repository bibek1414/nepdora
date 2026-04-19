import { SubscriptionHistoryList } from "@/components/site-owners/admin/subscription/subscription-history-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Subscriptions",
    pageDescription: "Manage your platform subscriptions and billing history.",
    pageRoute: "/admin/payments/subscriptions",
  });
}

export default function SubscriptionHistoryPage() {
  return <SubscriptionHistoryList showTitle={false} />;
}
