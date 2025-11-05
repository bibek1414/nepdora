import { Suspense } from "react";
import AuthWrapper from "@/components/super-admin/auth-wrapper";
import { BuilderLayout } from "@/components/super-admin/superadmin-builder/builder-layout";
import TemplateBuilderContent from "./template-builder-content";

export default function SuperadminTemplateBuilderPage() {
  return (
    <AuthWrapper>
      <Suspense fallback={<div>Loading template builder...</div>}>
        <TemplateBuilderContent />
      </Suspense>
    </AuthWrapper>
  );
}
