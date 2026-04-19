import { SubscriptionHistoryList } from "@/components/site-owners/admin/subscription/subscription-history-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Subscription History",
    pageDescription:
      "Review your billing history, subscription plans, and payment logs for {storeName}.",
    pageRoute: "/admin/subscriptions/history",
  });
}

import { redirect } from "next/navigation";

export default function SubscriptionHistoryPage() {
  redirect("/admin/payments");
}
