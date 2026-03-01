"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/site-owners/button";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { useDomains } from "@/hooks/super-admin/use-domain";
import { PageSkeleton } from "@/components/site-owners/shared/page-skeleton";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";

interface DynamicPageClientProps {
  siteUser: string;
  currentPageSlug: string;
  contentSlug?: string;
}

export default function DynamicPageClient({
  siteUser,
  currentPageSlug,
  contentSlug,
}: DynamicPageClientProps) {
  const router = useRouter();
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
    handlePortfolioClick,
  } = usePageData(siteUser, currentPageSlug);

  const handleComponentUpdate = () => {
    // Component update handlers (not used in publish mode)
  };

  const hasContent = pageComponents.length > 0;
  const domainExists = domainsData?.results?.some(
    domain => domain.tenant.schema_name === siteUser
  );

  // Prefetch common routes for faster navigation
  React.useEffect(() => {
    router.prefetch(`/${siteUser}/home`);
    router.prefetch(`/${siteUser}/products`);
    router.prefetch(`/${siteUser}/services`);
    router.prefetch(`/${siteUser}/blog`);
    router.prefetch(`/${siteUser}/contact`);
  }, [router, siteUser]);

  // Show error if domain doesn't exist
  if (!domainExists && !isDomainsLoading) {
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
      {/* Show minimal skeleton during loading to prevent white flash */}
      {(isComponentsLoading || isDomainsLoading) &&
      pageComponents.length === 0 ? (
        <PageSkeleton />
      ) : (
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
          onPortfolioClick={handlePortfolioClick}
          productSlug={contentSlug}
          blogSlug={contentSlug}
          serviceSlug={contentSlug}
          portfolioSlug={contentSlug}
        />
      )}

      <div className="p-8">
        {!hasContent && !isComponentsLoading ? (
          <div className="py-20 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The &apos;{currentPageSlug}&apos; page you&apos;re looking
              for doesn&apos;t exist.
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
