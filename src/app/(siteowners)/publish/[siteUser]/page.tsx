"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePages } from "@/hooks/owner-site/use-page";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { PageSkeleton } from "@/components/site-owners/shared/page-skeleton";
import { useDomains } from "@/hooks/super-admin/use-domain";

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
  const { data: domainsData, isLoading: isDomainsLoading } = useDomains(1, 100);

  const {
    pageComponents,
    isLoading: isComponentsLoading,
    handleBacktoHome,
    handleProductClick,
    handleBlogClick,
    handleServiceClick,
    handleCategoryClick,
    handleSubCategoryClick,
  } = usePageData(siteUser, homePageSlug);

  const handleComponentUpdate = () => {};

  if (isPagesLoading || isComponentsLoading) {
    return <PageSkeleton />;
  }

  const hasContent = pageComponents.length > 0;
  const domainExists = domainsData?.results?.some(
    domain => domain.tenant.schema_name === siteUser
  );

  if (isDomainsLoading || isPagesLoading || isComponentsLoading) {
    return <PageSkeleton />;
  }

  // Show error if domain doesn't exist
  if (!domainExists) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Domain Not Found
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            The domain{" "}
            <span className="font-mono font-semibold">{siteUser}</span>{" "}
            doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }
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
