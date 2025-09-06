"use client";
import React from "react";
import { use } from "react";
import { usePages } from "@/hooks/owner-site/use-page";
import { usePagePreview } from "@/hooks/preview/use-page-preview";
import { PageComponentRenderer } from "@/components/site-owners/preview/page-component-render";
import { LoadingSpinner } from "@/components/site-owners/preview/loading-spinner";

interface PreviewPageProps {
  params: Promise<{ siteUser: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { siteUser } = use(params);

  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();

  const homePage =
    pagesData.find(page => page.title?.trim().toLowerCase() === "home") ??
    pagesData[0];
  const homePageSlug = homePage?.slug || "";

  const {
    pageComponents,
    isComponentsLoading,
    handleProductClick,
    handleBlogClick,
    handleComponentUpdate,
  } = usePagePreview(siteUser, homePageSlug);

  if (isPagesLoading || isComponentsLoading) {
    return <LoadingSpinner message="Loading preview..." />;
  }

  return (
    <PageComponentRenderer
      components={pageComponents}
      siteUser={siteUser}
      pageSlug={homePageSlug}
      onProductClick={handleProductClick}
      onBlogClick={handleBlogClick}
      onComponentUpdate={handleComponentUpdate}
    />
  );
}
