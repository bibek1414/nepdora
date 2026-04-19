import CreateTemplateDialog from "@/components/super-admin/builder/template/create-template-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Management | Nepdora Superadmin",
  description: "Create and manage website templates for site owners.",
};

export default function TemplatePage() {
  return (
    <>
      <CreateTemplateDialog />
    </>
  );
}
