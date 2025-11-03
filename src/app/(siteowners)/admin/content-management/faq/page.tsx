import { FAQList } from "@/components/site-owners/admin/faq/faq-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "FAQ Management",
    pageDescription:
      "Manage FAQs efficiently in {storeName}. Add, edit, and organize frequently asked questions directly from the admin dashboard.",
    pageRoute: "/admin/faq",
  });
}

export default function FAQPage() {
  return <FAQList />;
}
