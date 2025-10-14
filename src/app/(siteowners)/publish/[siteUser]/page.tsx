"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePages } from "@/hooks/owner-site/use-page";
import { usePagePublished } from "@/hooks/publish/use-page-publish";
import { useDomains } from "@/hooks/superadmin/use-domain";
import { PageComponentRenderer } from "@/components/site-owners/publish/page-component-render";
import { LoadingSpinner } from "@/components/site-owners/publish/loading-spinner";

interface PublishPageProps {
  params: Promise<{ siteUser: string }>;
}

export default function PublishPage({ params }: PublishPageProps) {
  const { siteUser } = use(params);

  // Fetch all domains to validate the current domain
  const { data: domainsData, isLoading: isDomainsLoading } = useDomains(1, 100);
  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();

  // Find the home page by title or default to first page
  const homePage =
    pagesData.find(page => page.title?.trim().toLowerCase() === "home") ??
    pagesData[0];
  const homePageId = homePage?.id || "";

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
  } = usePagePublished(siteUser, homePageId);

  // Check if domain exists
  const domainExists = domainsData?.results?.some(
    domain => domain.tenant.schema_name === siteUser
  );

  if (isDomainsLoading || isPagesLoading || isComponentsLoading) {
    return <LoadingSpinner message="Loading..." />;
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

  const hasContent = pageComponents.length > 0;

  return (
    <>
      <PageComponentRenderer
        components={pageComponents}
        siteUser={siteUser}
        pageId={homePageId}
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
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The &apos;Home&apos; page you&apos;re looking for
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
