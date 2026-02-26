"use client";
import React, { useMemo } from "react";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";

interface ServiceDetailProps {
  slug: string;
  siteUser?: string;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  slug,
  siteUser,
}) => {
  const { pageComponents, isLoading } = usePageData(
    siteUser || "",
    "service-details"
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

  if (!pageComponents) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Service details page not configured.
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
          pageSlug="service-details"
          serviceSlug={slug}
          onProductClick={() => {}}
          onBlogClick={() => {}}
          onServiceClick={() => {}}
          onCategoryClick={() => {}}
          onSubCategoryClick={() => {}}
          onComponentUpdate={() => {}}
        />
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">
            Service details page is empty.
          </p>
        </div>
      )}
    </div>
  );
};
