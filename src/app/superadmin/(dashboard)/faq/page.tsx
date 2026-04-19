import { FAQList } from "@/components/super-admin/faq/faq-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Management | Nepdora Superadmin",
  description: "Manage frequently asked questions for the platform.",
};

export default function FAQPage() {
  return <FAQList />;
}
