import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicPageClient siteUser={siteUser} pageSlug={pageSlug} />
    </HydrationBoundary>
  );
}
