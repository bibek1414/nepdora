import { NewsletterList } from "@/components/site-owners/admin/newsletter/newsletter-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Newsletter Management",
    pageDescription:
      "Manage newsletters efficiently in {storeName}. Create, edit, and organize email campaigns directly from the admin dashboard.",
    pageRoute: "/admin/newsletter",
  });
}

export default function NewsletterPage() {
  return <NewsletterList />;
}
