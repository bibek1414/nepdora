import { TeamManagement } from "@/components/site-owners/admin/ourteam/team-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Team Management",
    pageDescription:
      "Manage your team efficiently in {storeName}. Add, edit, and organize team members directly from the admin dashboard.",
    pageRoute: "/admin/team-management",
  });
}

function TeamManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <TeamManagement />
    </div>
  );
}

export default TeamManagementPage;
