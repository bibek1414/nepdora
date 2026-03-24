import { getPublishedHomePagePayload } from "@/lib/publish-page-cache";
import PublishPageClient from "./page-client";

interface PublishPageProps {
  params: Promise<{ siteUser: string }>;
}

export default async function PublishPage({ params }: PublishPageProps) {
  const { siteUser } = await params;
  const pageData = await getPublishedHomePagePayload(siteUser).catch(error => {
    console.error("Failed to load cached published home page data:", error);
    return {
      currentPageSlug: "home",
      targetSlug: "home",
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
