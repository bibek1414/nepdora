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
import PreviewPageClient from "./page-client";

interface PreviewPageProps {
  params: Promise<{ siteUser: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { siteUser } = await params;
  const queryClient = new QueryClient();

  try {
    // Pre-fetch pages
    await queryClient.prefetchQuery({
      queryKey: ["pages", "preview"],
      queryFn: () => pageApi.getPages(),
    });

    // Find the home page slug
    const pagesData =
      queryClient.getQueryData<any[]>(["pages", "preview"]) || [];
    const homePage =
      pagesData.find(
        (page: any) => page.title?.trim().toLowerCase() === "home"
      ) ?? pagesData[0];
    const homePageSlug = homePage?.slug || "home";

    // Pre-fetch components, navbar, footer, themes
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["pageComponents", homePageSlug, "preview"],
        queryFn: () => componentsApi.getPageComponents(homePageSlug),
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
    console.error("Failed to prefetch preview data on server:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PreviewPageClient siteUser={siteUser} />
    </HydrationBoundary>
  );
}
