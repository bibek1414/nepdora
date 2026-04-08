import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import AddPortfolioClient from "./add-portfolio-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Add New Portfolio Item",
    pageDescription:
      "Showcase a new project or work in your portfolio for {storeName}. Add project details, categories, and images.",
    pageRoute: "/admin/portfolio/add",
  });
}

export default function AddPortfolioPage() {
  return <AddPortfolioClient />;
}
