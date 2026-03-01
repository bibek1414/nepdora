"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePages } from "@/hooks/owner-site/use-page";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { LoadingSpinner } from "@/components/site-owners/shared/loading-spinner";

interface PreviewPageProps {
  params: Promise<{ siteUser: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { siteUser } = use(params);

  const { data: pagesData = [], isLoading: isPagesLoading } =
    usePages("preview");

  const homePage = React.useMemo(() => {
    if (isPagesLoading) return null;
    return (
      pagesData.find(page => page.title?.trim().toLowerCase() === "home") ??
      pagesData[0]
    );
  }, [pagesData, isPagesLoading]);

  const homePageSlug = homePage?.slug || (isPagesLoading ? "" : "home");

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
  } = usePageData(siteUser, homePageSlug);

  const router = React.useMemo(() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return require("next/navigation").useRouter();
    } catch {
      return null;
    }
  }, []);

  React.useEffect(() => {
    if (!isPagesLoading && homePageSlug && homePageSlug !== "home") {
      router?.replace(`/preview/${siteUser}/${homePageSlug}`);
    }
  }, [homePageSlug, isPagesLoading, router, siteUser]);

  const handleComponentUpdate = () => {};

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
          onPortfolioClick={handlePortfolioClick}
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
