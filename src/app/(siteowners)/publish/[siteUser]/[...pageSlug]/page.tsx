import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { pageApi } from "@/services/api/owner-sites/page";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import { useFooterApi } from "@/services/api/owner-sites/components/footer";
import { useThemeApi } from "@/services/api/owner-sites/components/theme";
import { getDomains } from "@/services/api/super-admin/domain";
import { Metadata } from "next";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
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

  const queryClient = new QueryClient();

  try {
    // Pre-fetch domains
    await queryClient.prefetchQuery({
      queryKey: ["domains", 1, 100],
      queryFn: () => getDomains(1, 100)
    });

    // Pre-fetch pages (published)
    await queryClient.prefetchQuery({ 
      queryKey: ["pages", "published"], 
      queryFn: () => pageApi.getPages("published") 
    });
    
    // Determine exact slug to fetch components
    const pagesData = queryClient.getQueryData<any[]>(["pages", "published"]) || [];
    const matchingPage = pagesData.find(
      (p: any) => p.slug === currentPageSlug || p.slug === `${currentPageSlug}-draft`
    );
    const targetSlug = matchingPage?.slug || currentPageSlug;

    // Pre-fetch components, navbar, footer, themes for PUBLISHED data
    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ["pageComponents", targetSlug, "published"], queryFn: () => componentsApi.getPageComponentsPublished(targetSlug) }),
      queryClient.prefetchQuery({ queryKey: ["navbar", "published"], queryFn: () => useNavbarApi.getNavbarPublished() }),
      queryClient.prefetchQuery({ queryKey: ["footer", "published"], queryFn: () => useFooterApi.getFooterPublished() }),
      queryClient.prefetchQuery({ queryKey: ["themes", "published"], queryFn: () => useThemeApi.getThemesPublished() })
    ]);
  } catch (error) {
    console.error("Failed to prefetch dynamic published data on server:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicPageClient
        siteUser={siteUser}
        currentPageSlug={currentPageSlug}
        contentSlug={contentSlug}
      />
    </HydrationBoundary>
  );
}
