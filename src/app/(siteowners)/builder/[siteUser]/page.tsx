import React from "react";
import { BuilderLayout } from "@/components/site-owners/builder/builder-layout";
import { use } from "react";
interface BuilderPageProps {
  params: Promise<{ siteUser: string }>;
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const { siteUser } = use(params);

  return <BuilderLayout params={{ siteUser }} />;
}
