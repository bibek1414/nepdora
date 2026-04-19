import GatewaySettings from "@/components/site-owners/admin/payments/gateway-settings";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Payment Gateways",
    pageDescription:
      "Configure your store's payment gateways liked eSewa, Khalti, and more.",
    pageRoute: "/admin/payments/gateways",
  });
}

export default function GatewaySettingsPage() {
  return <GatewaySettings />;
}
