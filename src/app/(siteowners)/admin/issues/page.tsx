import IssuesList from "@/components/site-owners/admin/issues/issues-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Issue Management",
    pageDescription:
      "Manage issues and support tickets efficiently in {storeName}. Track, update, and resolve user-reported issues directly from the admin dashboard.",
    pageRoute: "/admin/issues",
  });
}

export default function IssuesPage() {
  return <IssuesList />;
}
