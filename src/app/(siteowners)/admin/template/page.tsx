import TemplateList from "@/components/site-owners/admin/templates/template-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Template",
    pageDescription:
      "Manage your team efficiently in {storeName}. Add, edit, and organize team members directly from the admin dashboard.",
    pageRoute: "/admin/template",
  });
}

const TemplatesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <TemplateList />
    </div>
  );
};

export default TemplatesPage;
