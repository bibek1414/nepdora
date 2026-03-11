import SkillManagement from "@/components/site-owners/admin/portfolio/skill-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Manage Skills",
    pageDescription: "Manage and organize your skills.",
    pageRoute: "/admin/portfolio/skills",
  });
}

export default function SkillManagementPage() {
  return <SkillManagement />;
}
