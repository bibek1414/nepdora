"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePages } from "@/hooks/owner-site/use-page";
import { usePagePreview } from "@/hooks/preview/use-page-preview";
import { PageComponentRenderer } from "@/components/site-owners/preview/page-component-render";
import { LoadingSpinner } from "@/components/site-owners/preview/loading-spinner";

interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageId?: number[];
  }>;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const { siteUser, pageId } = use(params);
  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();

  // Get the pageId from the URL params (first element of the array)
  const currentPageId = pageId && pageId.length > 0 ? pageId[0] : null;

  // Find the page by ID or default to home
  const homePage =
    pagesData.find(page => page.title?.trim().toLowerCase() === "home") ??
    pagesData[0];
  const defaultPageId = homePage?.id;

  // Use the pageId from URL or default to home page ID
  const activePageId = currentPageId || defaultPageId;

  // Find the current page for display purposes
  const currentPage = pagesData.find(page => page.id === activePageId);

  const {
    pageComponents,
    isComponentsLoading,
    handleBacktoHome,
    handleProductClick,
    handleBlogClick,
    handleServiceClick,
    handleCategoryClick,
    handleSubCategoryClick,
    handleComponentUpdate,
  } = usePagePreview(siteUser, activePageId || "");

  if (isPagesLoading || isComponentsLoading) {
    return <LoadingSpinner message={`Loading page...`} />;
  }

  const hasContent = pageComponents.length > 0;
  const pageName = currentPage?.title || "Page";

  return (
    <>
      <PageComponentRenderer
        components={pageComponents}
        siteUser={siteUser}
        pageId={activePageId || ""}
        onProductClick={handleProductClick}
        onBlogClick={handleBlogClick}
        onComponentUpdate={handleComponentUpdate}
        onServiceClick={handleServiceClick}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />

      <div className="p-8">
        {!hasContent ? (
          <div className="py-20 text-center">
            {/* Heading */}
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The &apos;{pageName}&apos; page you&apos;re looking for
              doesn&apos;t exist.
            </h3>

            <Button
              onClick={handleBacktoHome}
              className="mt-4"
              variant="default"
            >
              Go back home
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
