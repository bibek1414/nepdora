import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import ContentManagementClient from "./content-management-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Content Management",
    pageDescription:
      "Access and manage various types of content for {storeName}. Manage blogs, services, portfolio items, and more from a central hub.",
    pageRoute: "/admin/content-management",
  });
}

export default function ContentManagementPage() {
  return <ContentManagementClient />;
}
