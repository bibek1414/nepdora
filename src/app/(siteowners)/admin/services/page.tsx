import ServicesManagement from "@/components/site-owners/admin/services/services-management";
import CategoryManagement from "@/components/site-owners/admin/services/category-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import ServicesHeader from "@/components/site-owners/admin/services/services-header";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Services Management",
    pageDescription:
      "Manage services offered by {storeName}. Add, edit, and organize your service listings directly from the admin dashboard to keep your offerings up to date.",
    pageRoute: "/admin/services",
  });
}

export default function ServicesManagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <ServicesHeader />
        <div className="mt-8">
          <ServicesManagement />
        </div>
      </div>
    </div>
  );
}
