"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/site-owners/button";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { ComponentResponse } from "@/types/owner-site/components/components";

interface PublishPageClientProps {
  siteUser: string;
  initialPageSlug: string;
  initialPageComponents: ComponentResponse[];
}

export default function PublishPageClient({
  siteUser,
  initialPageSlug,
  initialPageComponents,
}: PublishPageClientProps) {
  const router = useRouter();
  const pageComponents = React.useMemo(
    () => initialPageComponents ?? [],
    [initialPageComponents]
  );
  const handleBacktoHome = React.useCallback(() => {
    router.push(`/publish/${siteUser}`);
  }, [router, siteUser]);
  const handleProductClick = React.useCallback(
    (productSlug: string) => {
      router.push(`/publish/${siteUser}/product-details/${productSlug}`);
    },
    [router, siteUser]
  );
  const handleBlogClick = React.useCallback(
    (blogSlug: string) => {
      router.push(`/publish/${siteUser}/blog-details/${blogSlug}`);
    },
    [router, siteUser]
  );
  const handleServiceClick = React.useCallback(
    (serviceSlug: string) => {
      router.push(`/publish/${siteUser}/service-details/${serviceSlug}`);
    },
    [router, siteUser]
  );
  const handleCategoryClick = React.useCallback(
    (categoryId: number) => {
      router.push(`/publish/${siteUser}/categories/${categoryId}`);
    },
    [router, siteUser]
  );
  const handleSubCategoryClick = React.useCallback(
    (subcategoryId: number) => {
      router.push(`/publish/${siteUser}/subcategories/${subcategoryId}`);
    },
    [router, siteUser]
  );
  const handlePortfolioClick = React.useCallback(
    (portfolioSlug: string) => {
      router.push(`/publish/${siteUser}/portfolio-details/${portfolioSlug}`);
    },
    [router, siteUser]
  );
  const handleComponentUpdate = () => {};

  const hasContent = pageComponents.length > 0;

  return (
    <>
      {hasContent ? (
        <PageComponentRenderer
          components={pageComponents}
          siteUser={siteUser}
          pageSlug={initialPageSlug}
          onProductClick={handleProductClick}
          onBlogClick={handleBlogClick}
          onComponentUpdate={handleComponentUpdate}
          onServiceClick={handleServiceClick}
          onCategoryClick={handleCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
          onPortfolioClick={handlePortfolioClick}
        />
      ) : null}

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
