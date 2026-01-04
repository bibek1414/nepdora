import { Suspense } from "react";
import NewsletterManagement from "@/components/super-admin/newsletter/newsletter-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Newsletter Management",
    pageDescription: "Manage Nepdora newsletter subscriptions.",
    pageRoute: "/superadmin/newsletter",
  });
}

export default function NewsletterManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsletterManagement />
    </Suspense>
  );
}
