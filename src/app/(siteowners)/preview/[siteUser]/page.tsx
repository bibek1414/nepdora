"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
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
  const homePageSlug = homePage?.slug || "home";

  const {
    pageComponents,
    isComponentsLoading,
    handleBacktoHome,
    handleProductClick,
    handleBlogClick,
    handleComponentUpdate,
    handleServiceClick,
    handleCategoryClick,
    handleSubCategoryClick,
  } = usePagePreview(siteUser, homePageSlug);

  if (isPagesLoading || isComponentsLoading) {
    return <LoadingSpinner message="Loading preview..." />;
  }

  const hasContent = pageComponents.length > 0;

  return (
    <>
      {hasContent && (
        <PageComponentRenderer
          components={pageComponents}
          siteUser={siteUser}
          pageSlug={homePageSlug}
          onProductClick={handleProductClick}
          onBlogClick={handleBlogClick}
          onComponentUpdate={handleComponentUpdate}
          onServiceClick={handleServiceClick}
          onCategoryClick={handleCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
        />
      )}

      <div className="p-8">
        {!hasContent ? (
          <div className="py-20 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The &apos; Home&apos; page you’re looking for doesn’t exist.
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
