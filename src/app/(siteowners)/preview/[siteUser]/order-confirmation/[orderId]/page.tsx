"use client";

import React, { use } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { PageSkeleton } from "@/components/site-owners/shared/page-skeleton";

interface PageProps {
  params: Promise<{
    siteUser: string;
    orderId: string;
  }>;
}

export default function OrderConfirmation({ params }: PageProps) {
  const { siteUser } = use(params);
  const currentPageSlug = "order-confirmation-draft";

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

  const handleComponentUpdate = () => {};

  if (isComponentsLoading) {
    return <PageSkeleton />;
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
        {!hasContent && !isComponentsLoading ? (
          <div className="py-20 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The order confirmation page doesn't exist.
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
