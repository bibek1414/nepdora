import PaymentsClient from "../payments-client";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Payment History",
    pageDescription: "View and track all transaction history for your store.",
    pageRoute: "/admin/payments/history",
  });
}

export default function PaymentHistoryPage() {
  return <PaymentsClient showTitle={false} />;
}
