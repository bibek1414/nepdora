"use client";
import React, { useState } from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard12 } from "../products-card/product-card12";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { FeaturedProductsButton } from "../featured-products-button";
import Pagination from "@/components/ui/site-owners/pagination";
import { cn } from "@/lib/utils";

interface ProductsStyleProps {
  data: ProductsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ProductsComponentData["data"]>) => void;
  onProductClick?: (productslug: string) => void;
}

export const ProductsStyle12: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const {
    title = "Featured Products",
    subtitle = "Discover our latest arrivals and best sellers",
    categoryId,
    subCategoryId,
    page_size = 16,
  } = data || {};

  const [currentPage, setCurrentPage] = useState(1);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useProducts({
    category_id: categoryId,
    sub_category_id: subCategoryId,
    page: currentPage,
    page_size: page_size,
  });

  const products = productsData?.results || [];
  const pagination = productsData?.pagination;

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center md:mb-16">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto text-base md:text-lg"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: page_size }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Products</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load products. Please try again later."}
            </AlertDescription>
          </Alert>
        )}

        {/* Products Display */}
        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: any, index: number) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() =>
                    !isEditable && onProductClick?.(product.slug || "")
                  }
                >
                  <ProductCard12
                    product={product}
                    siteUser={isEditable ? undefined : siteUser}
                    isEditable={isEditable}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-16 flex justify-center border-t border-gray-100 pt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={page => {
                    setCurrentPage(page);
                    // Smooth scroll to top of section
                    window.scrollTo({
                      top: document.querySelector("section")?.offsetTop || 0,
                      behavior: "smooth",
                    });
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <BuilderEmptyState
            icon={ShoppingBag}
            title="No Products Found"
            description="Showcase your products to your customers. Add products from the admin dashboard."
            actionLabel="Add New Products"
            actionLink="/admin/products"
            isEditable={isEditable}
            isEmpty={true}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
