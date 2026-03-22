import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { pageApi } from "@/services/api/owner-sites/page";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import { useFooterApi } from "@/services/api/owner-sites/components/footer";
import { useThemeApi } from "@/services/api/owner-sites/components/theme";
import { getDomains } from "@/services/api/super-admin/domain";
import PublishPageClient from "./page-client";

interface PublishPageProps {
  params: Promise<{ siteUser: string }>;
}

export default async function PublishPage({ params }: PublishPageProps) {
  const { siteUser } = await params;
  const queryClient = new QueryClient();

  try {
    // Pre-fetch domains to verify existence
    await queryClient.prefetchQuery({
      queryKey: ["domains", 1, 100],
      queryFn: () => getDomains(1, 100)
    });

    // Pre-fetch pages (published)
    await queryClient.prefetchQuery({ 
      queryKey: ["pages", "published"], 
      queryFn: () => pageApi.getPages("published") 
    });
    
    // Extract the home page slug
    const pagesData = queryClient.getQueryData<any[]>(["pages", "published"]) || [];
    const homePage = pagesData.find((page: any) => page.title?.trim().toLowerCase() === "home") ?? pagesData[0];
    const homePageSlug = homePage?.slug || "home";

    // Pre-fetch components, navbar, footer, themes for PUBLISHED data
    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ["pageComponents", homePageSlug, "published"], queryFn: () => componentsApi.getPageComponentsPublished(homePageSlug) }),
      queryClient.prefetchQuery({ queryKey: ["navbar", "published"], queryFn: () => useNavbarApi.getNavbarPublished() }),
      queryClient.prefetchQuery({ queryKey: ["footer", "published"], queryFn: () => useFooterApi.getFooterPublished() }),
      queryClient.prefetchQuery({ queryKey: ["themes", "published"], queryFn: () => useThemeApi.getThemesPublished() })
    ]);
  } catch (error) {
    console.error("Failed to prefetch published data on server:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublishPageClient siteUser={siteUser} />
    </HydrationBoundary>
  );
}
