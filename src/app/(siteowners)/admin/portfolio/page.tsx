import PortfoliosManagement from "@/components/site-owners/admin/portfolio/portfolio-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Portfolio Management",
    pageDescription:
      "Manage portfolios for {storeName}. Add, edit, and organize your work or project showcases directly from the admin dashboard.",
    pageRoute: "/admin/portfolio",
  });
}

export default function PortfolioManagementPage() {
  return <PortfoliosManagement />;
}
