import type { Metadata } from "next";
import {
  derivePublishContentMetadata,
  generatePublishPageMetadata,
} from "@/lib/metadata-utils";
import { getPublishedHomePagePayload } from "@/lib/publish-page-cache";
import PublishPageClient from "./page-client";

interface PublishPageProps {
  params: Promise<{ siteUser: string }>;
}

export async function generateMetadata({
  params,
}: PublishPageProps): Promise<Metadata> {
  const { siteUser } = await params;
  const pageData = await getPublishedHomePagePayload(siteUser).catch(() => null);
  const pageMetadata = derivePublishContentMetadata(
    pageData?.pageTitle || "Home",
    pageData?.pageComponents || []
  );

  return generatePublishPageMetadata({
    pageName: pageMetadata.title || "Home",
    pageDescription:
      pageMetadata.description ||
      `Explore the homepage for ${siteUser}. View content, products, and services dynamically.`,
    pageRoute: "/",
    pageImage: pageMetadata.image,
  });
}

export default async function PublishPage({ params }: PublishPageProps) {
  const { siteUser } = await params;
  const pageData = await getPublishedHomePagePayload(siteUser).catch(error => {
    console.error("Failed to load cached published home page data:", error);
    return {
      currentPageSlug: "home",
      targetSlug: "home",
      pageTitle: "Home",
      pageComponents: [],
    };
  });

  return (
    <PublishPageClient
      siteUser={siteUser}
      initialPageSlug={pageData.targetSlug}
      initialPageComponents={pageData.pageComponents}
    />
  );
}
