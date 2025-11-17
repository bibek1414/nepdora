import TemplateList from "@/components/site-owners/admin/templates/template-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates | Choose Your Design",
  description:
    "Browse and choose from our collection of professionally designed templates. Preview and import templates to get started quickly.",
};

const TemplatesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <TemplateList />
    </div>
  );
};

export default TemplatesPage;
