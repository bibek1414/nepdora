import React, { use } from "react";
import { BuilderLayout } from "@/components/site-owners/builder/builder/builder-layout";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

interface BuilderPageProps {
  params: Promise<{ siteUser: string; pageSlug: string }>;
}

export async function generateMetadata({
  params,
}: BuilderPageProps): Promise<Metadata> {
  const { siteUser, pageSlug } = await params;

  return generateAdminPageMetadata({
    pageName: `${pageSlug ? pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1) : "Builder"} | ${siteUser}`,
    pageDescription: `Customize the ${pageSlug || "page"} for ${siteUser}. Use the builder to design, edit, and structure your website pages easily.`,
    pageRoute: `/builder/${siteUser}/${pageSlug}`,
  });
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const { siteUser, pageSlug } = use(params);

  return <BuilderLayout params={{ siteUser, pageSlug }} />;
}
