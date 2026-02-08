"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { LoadingSpinner } from "@/components/site-owners/shared/loading-spinner";
interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageSlug?: string[];
  }>;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const { siteUser, pageSlug } = use(params);

  const currentPageSlug =
    pageSlug && pageSlug.length > 0 ? pageSlug[0] : "home";

  const {
    pageComponents,
    isLoading: isComponentsLoading,
    handleBacktoHome,
    handleProductClick,
    handleBlogClick,
    handleServiceClick,
    handleCategoryClick,
    handleSubCategoryClick,
  } = usePageData(siteUser, currentPageSlug);

  const handleComponentUpdate = () => {
    // Component update handlers (not used in preview mode)
  };

  if (isComponentsLoading) {
    return <LoadingSpinner message={`Loading ${currentPageSlug} page...`} />;
  }

  const hasContent = pageComponents.length > 0;

  return (
    <>
      <PageComponentRenderer
        components={pageComponents}
        siteUser={siteUser}
        pageSlug={currentPageSlug}
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
              Oops! The &apos;
              {currentPageSlug}&apos; page you’re looking for doesn’t exist.
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
