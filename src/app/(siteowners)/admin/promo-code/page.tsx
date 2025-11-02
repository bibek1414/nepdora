import { PromoCodeList } from "@/components/site-owners/admin/promo-code/promo-code-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Promo Code Management",
    pageDescription:
      "Manage promo codes and discounts for {storeName}. Create, edit, and organize coupon codes to boost sales and reward customers from the admin dashboard.",
    pageRoute: "/admin/promo-codes",
  });
}

export default function PromoCodeManagementPage() {
  return (
    <div className="mx-auto p-5 py-10">
      <PromoCodeList />
    </div>
  );
}
