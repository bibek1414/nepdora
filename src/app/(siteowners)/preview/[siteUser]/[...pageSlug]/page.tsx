import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { pageApi } from "@/services/api/owner-sites/page";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import { useFooterApi } from "@/services/api/owner-sites/components/footer";
import { useThemeApi } from "@/services/api/owner-sites/components/theme";
import DynamicPageClient from "./page-client";

interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageSlug?: string[];
  }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { siteUser, pageSlug } = await params;
  const queryClient = new QueryClient();

  try {
    // Pre-fetch pages
    await queryClient.prefetchQuery({
      queryKey: ["pages", "preview"],
      queryFn: () => pageApi.getPages(),
    });

    // Determine the slug that will be fetched by the client
    const pagesData =
      queryClient.getQueryData<any[]>(["pages", "preview"]) || [];
    const slugFromUrl = pageSlug && pageSlug.length > 0 ? pageSlug[0] : "home";

    const matchingPage = pagesData.find(
      (p: any) => p.slug === slugFromUrl || p.slug === `${slugFromUrl}-draft`
    );
    const currentPageSlug = matchingPage?.slug || slugFromUrl;

    // Pre-fetch components, navbar, footer, themes
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["pageComponents", currentPageSlug, "preview"],
        queryFn: () => componentsApi.getPageComponents(currentPageSlug),
      }),
      queryClient.prefetchQuery({
        queryKey: ["navbar"],
        queryFn: () => useNavbarApi.getNavbar(),
      }),
      queryClient.prefetchQuery({
        queryKey: ["footer"],
        queryFn: () => useFooterApi.getFooter(),
      }),
      queryClient.prefetchQuery({
        queryKey: ["themes"],
        queryFn: () => useThemeApi.getThemes(),
      }),
    ]);
  } catch (error) {
    console.error("Failed to prefetch preview dynamic data on server:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicPageClient siteUser={siteUser} pageSlug={pageSlug} />
    </HydrationBoundary>
  );
}
