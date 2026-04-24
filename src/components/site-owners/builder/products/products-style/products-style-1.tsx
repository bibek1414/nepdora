"use client";
import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard1 } from "../products-card/product-card1";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { FeaturedProductsButton } from "../featured-products-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductsStyleProps {
  data: ProductsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ProductsComponentData["data"]>) => void;
  onProductClick?: (productslug: string) => void;
}

export const ProductsStyle1: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const {
    title = "Our Products",
    subtitle,
    categoryId,
    subCategoryId,
    display_type = "carousel",
    carousel_style = "style-10",
  } = data || {};
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
  });
  const products = productsData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-foreground mb-4 text-4xl font-bold tracking-tight"
              style={{ fontFamily: theme.fonts.heading }}
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground max-w-3xl text-xl"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          </div>
          {display_type === "carousel" && carousel_style === "style-5" && (
            <div className="flex gap-3 self-center md:self-end">
              <div id="carousel-nav-style-5-1" className="flex gap-3" />
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex min-w-[280px] flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Products</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load products."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && products.length > 0 && (
          display_type === "carousel" ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {products.map(product => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div
                      className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() =>
                        !isEditable && onProductClick?.(product.slug || "")
                      }
                    >
                      {isEditable && (
                        <div className="absolute inset-0 z-10 bg-transparent" />
                      )}
                      <ProductCard1
                        product={product}
                        siteUser={isEditable ? undefined : siteUser}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {carousel_style === "style-10" ? (
                <>
                  <CarouselPrevious className="left-2 bg-white/80 shadow-md hover:bg-white" />
                  <CarouselNext className="right-2 bg-white/80 shadow-md hover:bg-white" />
                </>
              ) : (
                <div className="mt-8 flex justify-end gap-3 md:absolute md:-top-24 md:right-0">
                  <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-gray-100 bg-white" />
                  <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-gray-100 bg-white" />
                </div>
              )}
            </Carousel>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() =>
                    !isEditable && onProductClick?.(product.slug || "")
                  }
                >
                  {isEditable && (
                    <div className="absolute inset-0 z-10 bg-transparent" />
                  )}
                  <ProductCard1
                    product={product}
                    siteUser={isEditable ? undefined : siteUser}
                  />
                </div>
              ))}
            </div>
          )
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={ShoppingBag}
            title="No Products Found"
            description="Showcase your products to your customers. Add products from the admin dashboard."
            actionLabel="Add New Products"
            actionLink="/admin/products"
            isEditable={isEditable}
            isEmpty={products.length === 0}
            onRefresh={refetch}
          />
        )}

        <FeaturedProductsButton
          isEditable={isEditable}
        />
      </div>
    </section>
  );
};
