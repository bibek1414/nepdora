import SupportHeader from "@/components/site-owners/admin/support/support-header";
import SupportFAQ from "@/components/site-owners/admin/support/support-faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Support | Help Center & FAQs",
  description:
    "Get help with Nepdora. Visit our Support Center to find answers to common questions, explore FAQs, and contact our team for personalized assistance.",
};

export default function SupportPage() {
  return (
    <>
      <SupportHeader />
      <SupportFAQ />
    </>
  );
}
