"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";
import { use } from "react";
import { usePagePreview } from "@/hooks/preview/use-page-preview";
import { PageComponentRenderer } from "@/components/site-owners/preview/page-component-render";
import { LoadingSpinner } from "@/components/site-owners/preview/loading-spinner";

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
    isComponentsLoading,
    handleBackToBuilder,
    handleProductClick,
    handleBlogClick,
    handleComponentUpdate,
  } = usePagePreview(siteUser, currentPageSlug);

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
      />

      <div className="p-8">
        {!hasContent ? (
          <div className="py-20 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Monitor className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              No Content for &apos;{currentPageSlug}&apos; page
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              Go back to the builder and start adding components to the &apos;
              {currentPageSlug}&apos; page.
            </p>
            <Button onClick={handleBackToBuilder} className="mt-4">
              Open Builder
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {currentPageSlug.charAt(0).toUpperCase() +
                  currentPageSlug.slice(1)}{" "}
                Page
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                You&apos;re viewing the {currentPageSlug} page preview.
              </p>
              <Button onClick={handleBackToBuilder} size="lg">
                Continue Building
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
