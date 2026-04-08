import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import EditPortfolioClient from "./edit-portfolio-client";

interface EditPortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EditPortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateAdminPageMetadata({
    pageName: "Edit Portfolio Item",
    pageDescription: `Edit your portfolio item "${slug}" for {storeName}. Update project details, images, and SEO settings.`,
    pageRoute: `/admin/portfolio/edit/${slug}`,
  });
}

export default function EditPortfolioPage() {
  return <EditPortfolioClient />;
}
