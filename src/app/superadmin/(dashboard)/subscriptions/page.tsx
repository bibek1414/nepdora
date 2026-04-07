import { SubscriptionsOverview } from "@/components/super-admin/subscriptions/subscriptions-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Management | Nepdora Superadmin",
  description: "Comprehensive overview of all platform-wide user subscriptions.",
};

export default function SubscriptionsPage() {
  return <SubscriptionsOverview />;
}
