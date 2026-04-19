import PaymentsClient from "@/components/super-admin/payments/payments-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Management | Nepdora Superadmin",
  description: "Monitor and manage platform-wide payments and gateways.",
};

export default function SuperAdminPaymentsPage() {
  return <PaymentsClient />;
}
