import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import PaymentsClient from "./payments-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Payments",
    pageDescription:
      "Monitor and manage store payments for {storeName}. View transaction history and payment statuses.",
    pageRoute: "/admin/payments",
  });
}

export default function PaymentsPage() {
  return <PaymentsClient />;
}
