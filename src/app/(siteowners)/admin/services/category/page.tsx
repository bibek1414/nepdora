import CategoryManagement from "@/components/site-owners/admin/services/category-management";
import ServicesHeader from "@/components/site-owners/admin/services/services-header";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Service Categories",
    pageDescription: "Manage and organize your service categories.",
    pageRoute: "/admin/services/category",
  });
}

export default function CategoryManagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <ServicesHeader />
        <div className="mt-8">
          <CategoryManagement />
        </div>
      </div>
    </div>
  );
}
