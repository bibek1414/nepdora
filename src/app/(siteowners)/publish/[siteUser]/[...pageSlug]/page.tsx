"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { use } from "react";
import { usePagePublished } from "@/hooks/publish/use-page-publish";
import { useDomains } from "@/hooks/superadmin/use-domain";
import { PageComponentRenderer } from "@/components/site-owners/publish/page-component-render";
import { LoadingSpinner } from "@/components/site-owners/publish/loading-spinner";

interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageId?: number[];
  }>;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const { siteUser, pageId } = use(params);

  // Fetch all domains to validate the current domain
  const { data: domainsData, isLoading: isDomainsLoading } = useDomains(1, 100);

  // Get the pageId from the URL params (first element of the array)
  const currentPageId = pageId && pageId.length > 0 ? pageId[0] : null;

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
  } = usePagePublished(siteUser, currentPageId || "");

  // Check if domain exists
  const domainExists = domainsData?.results?.some(
    domain => domain.tenant.schema_name === siteUser
  );

  if (isDomainsLoading || isComponentsLoading) {
    return <LoadingSpinner message={`Loading page...`} />;
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
  const pageName = currentPageId ? `Page ${currentPageId}` : "Home";

  return (
    <>
      <PageComponentRenderer
        components={pageComponents}
        siteUser={siteUser}
        pageId={currentPageId || ""}
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
