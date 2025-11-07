import { BuilderLayout } from "@/components/super-admin/builder/builder/builder-layout";
import React, { use } from "react";
interface PageProps {
  params: Promise<{
    templateSlug: string;
    pageSlug: string;
  }>;
}

export default function TemplatePage({ params }: PageProps) {
  const { templateSlug, pageSlug } = use(params);
  return <BuilderLayout params={{ templateSlug, pageSlug }} />;
}
