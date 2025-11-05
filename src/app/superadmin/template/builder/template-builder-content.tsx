"use client";

import { useSearchParams } from "next/navigation";
import { BuilderLayout } from "@/components/super-admin/superadmin-builder/builder-layout";

export default function TemplateBuilderContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  return (
    <BuilderLayout
      params={{ siteUser: "superadmin", pageSlug: templateId || "template" }}
    />
  );
}
