import { YouTubeList } from "@/components/site-owners/admin/youtube/youtube-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "YouTube Management",
    pageDescription:
      "Manage YouTube videos for {storeName}. Add, organize, and display YouTube content directly from your admin dashboard to engage your audience.",
    pageRoute: "/admin/youtube",
  });
}

export default function YouTubeManagementPage() {
  return <YouTubeList />;
}
