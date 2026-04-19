import { Suspense } from "react";
import NewsletterManagement from "@/components/super-admin/newsletter/newsletter-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Management | Nepdora Superadmin",
  description: "Manage and send newsletters to your platform subscribers.",
};

export default function NewsletterManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsletterManagement />
    </Suspense>
  );
}
