"use client";
import React from "react";
import { usePageData } from "@/hooks/owner-site/use-page-data";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { PageSkeleton } from "@/components/site-owners/shared/page-skeleton";

interface ProductDetailProps {
  slug: string;
  siteUser?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  slug,
  siteUser,
}) => {
  // Use a fixed slug "product-details" as the template for all single product pages
  const {
    pageComponents,
    isLoading,
    handleProductClick,
    handleBlogClick,
    handleServiceClick,
    handleCategoryClick,
    handleSubCategoryClick,
  } = usePageData(siteUser || "", "product-details");

  const handleComponentUpdate = () => {
    // Not applicable in preview/publish
  };

  if (isLoading && pageComponents.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <PageComponentRenderer
      components={pageComponents}
      siteUser={siteUser || ""}
      pageSlug="product-details"
      productSlug={slug}
      onProductClick={handleProductClick}
      onBlogClick={handleBlogClick}
      onServiceClick={handleServiceClick}
      onCategoryClick={handleCategoryClick}
      onSubCategoryClick={handleSubCategoryClick}
      onComponentUpdate={handleComponentUpdate}
    />
  );
};
