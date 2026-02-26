"use client";
import React, { useMemo } from "react";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";

interface BlogDetailProps {
  slug: string;
  siteUser?: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ slug, siteUser }) => {
  const { pageComponents, isLoading } = usePageData(
    siteUser || "",
    "blog-details"
  );

  const components = useMemo(() => {
    return pageComponents || [];
  }, [pageComponents]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  // It's safe to assume if not loading and no components, it's missing data.
  // Custom error can be implemented if usePageData exposed it.
  if (!pageComponents) {
    // If no dynamic page is set up, fallback could be added here, but for now we'll just return null or a basic error
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Blog details page not configured.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {components.length > 0 ? (
        <PageComponentRenderer
          components={components}
          siteUser={siteUser || ""}
          pageSlug="blog-details"
          blogSlug={slug}
          onProductClick={() => {}}
          onBlogClick={() => {}}
          onServiceClick={() => {}}
          onCategoryClick={() => {}}
          onSubCategoryClick={() => {}}
          onComponentUpdate={() => {}}
        />
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Blog details page is empty.</p>
        </div>
      )}
    </div>
  );
};
