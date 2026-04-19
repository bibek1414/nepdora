import { redirect } from "next/navigation";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Payments",
    pageDescription: "Manage your store's payment systems and settings.",
    pageRoute: "/admin/payments",
  });
}

export default function PaymentsPage() {
  redirect("/admin/payments/history");
}
