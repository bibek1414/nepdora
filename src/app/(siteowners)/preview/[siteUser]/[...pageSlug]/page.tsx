"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { PageSkeleton } from "@/components/site-owners/shared/page-skeleton";
import { usePages } from "@/hooks/owner-site/use-page";

interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageSlug?: string[];
  }>;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const { siteUser, pageSlug } = use(params);

  const { data: pagesData = [], isLoading: isPagesLoading } =
    usePages("preview");

  const currentPageData = React.useMemo(() => {
    const slugFromUrl = pageSlug && pageSlug.length > 0 ? pageSlug[0] : "home";
    const contentSlug =
      pageSlug && pageSlug.length > 1 ? pageSlug[1] : undefined;

    if (isPagesLoading) return { pageSlug: slugFromUrl, contentSlug };

    // Find if there's a draft version or exact match
    const matchingPage = pagesData.find(
      p => p.slug === slugFromUrl || p.slug === `${slugFromUrl}-draft`
    );

    return {
      pageSlug: matchingPage?.slug || slugFromUrl,
      contentSlug,
    };
  }, [pageSlug, pagesData, isPagesLoading]);

  const {
    pageComponents,
    isLoading: isComponentsLoading,
    handleBacktoHome,
    handleProductClick,
    handleBlogClick,
    handleServiceClick,
    handleCategoryClick,
    handleSubCategoryClick,
    handlePortfolioClick,
  } = usePageData(siteUser, currentPageData.pageSlug);

  const handleComponentUpdate = () => {
    // Component update handlers (not used in preview mode)
  };

  if (isComponentsLoading) {
    return <PageSkeleton />;
  }

  const hasContent = pageComponents.length > 0;

  return (
    <>
      <PageComponentRenderer
        components={pageComponents}
        siteUser={siteUser}
        pageSlug={currentPageData.pageSlug}
        onProductClick={handleProductClick}
        onBlogClick={handleBlogClick}
        onComponentUpdate={handleComponentUpdate}
        onServiceClick={handleServiceClick}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
        onPortfolioClick={handlePortfolioClick}
        productSlug={currentPageData.contentSlug}
        blogSlug={currentPageData.contentSlug}
        serviceSlug={currentPageData.contentSlug}
        portfolioSlug={currentPageData.contentSlug}
      />

      <div className="p-8">
        {!hasContent ? (
          <div className="py-20 text-center">
            {/* Heading */}
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The &apos;
              {currentPageData.pageSlug}&apos; page you’re looking for doesn’t
              exist.
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
