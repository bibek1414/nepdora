import { PricingList } from "@/components/site-owners/admin/pricing/pricing-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Pricing Management",
    pageDescription:
      "Manage pricing plans efficiently for {storeName}. Add, edit, and organize pricing plans and features directly from the admin dashboard.",
    pageRoute: "/admin/pricing",
  });
}

export default function PricingManagementPage() {
  return (
    <div className="mx-auto p-5 py-10">
      <PricingList />
    </div>
  );
}
