import { Metadata } from "next";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import { getPublishedPagePayload } from "@/lib/publish-page-cache";
import DynamicPageClient from "./dynamic-page-client";

interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageSlug?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { siteUser, pageSlug } = await params;
  const currentPageSlug =
    pageSlug && pageSlug.length > 0 ? pageSlug[0] : "home";

  return generatePublishPageMetadata({
    pageName:
      currentPageSlug.charAt(0).toUpperCase() + currentPageSlug.slice(1),
    pageDescription: `Explore the ${currentPageSlug} page for ${siteUser}. View content, products, and services dynamically.`,
    pageRoute: `/${siteUser}/${currentPageSlug}`,
  });
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { siteUser, pageSlug } = await params;
  const currentPageSlug =
    pageSlug && pageSlug.length > 0 ? pageSlug[0] : "home";
  const contentSlug = pageSlug && pageSlug.length > 1 ? pageSlug[1] : undefined;
  const pageData = await getPublishedPagePayload(
    siteUser,
    currentPageSlug,
    contentSlug
  ).catch(error => {
    console.error("Failed to load cached published page data:", error);
    return {
      currentPageSlug,
      targetSlug: currentPageSlug,
      contentSlug,
      pageComponents: [],
    };
  });

  return (
    <DynamicPageClient
      siteUser={siteUser}
      currentPageSlug={pageData.currentPageSlug}
      contentSlug={pageData.contentSlug}
      initialPageSlug={pageData.targetSlug}
      initialPageComponents={pageData.pageComponents}
    />
  );
}
