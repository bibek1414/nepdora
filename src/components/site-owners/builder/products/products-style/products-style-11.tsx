"use client";
import React from "react";
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

export const ProductsStyle11: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const {
    title = "Our Collection",
    subtitle,
    categoryId,
    subCategoryId,
    display_type = "grid",
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
    page_size: 6,
    is_popular: true,
  });
  const products = productsData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl"
              style={{ fontFamily: theme.fonts.heading }}
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground max-w-2xl text-lg md:text-xl"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          </div>
          {display_type === "carousel" && carousel_style === "style-5" && (
            <div className="flex gap-3 self-center md:self-end">
              {/* Navigation will be rendered inside the Carousel component below */}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-5">
                <Skeleton className="aspect-4/3 w-full rounded-[1.25rem]" />
                <div className="space-y-3">
                  <Skeleton className="h-7 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Products</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load products."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading &&
          !error &&
          products.length > 0 &&
          (display_type === "carousel" ? (
            <div
              className={`relative ${carousel_style === "style-10" ? "px-12" : ""}`}
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-6">
                  {products.map((product: any) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-6 md:basis-1/2 lg:basis-1/3"
                    >
                      <div
                        className="relative"
                        onClick={() =>
                          !isEditable && onProductClick?.(product.slug || "")
                        }
                      >
                        {isEditable && (
                          <div className="absolute inset-0 z-10 bg-transparent" />
                        )}
                        <ProductCard12
                          product={product}
                          siteUser={isEditable ? undefined : siteUser}
                          showPrice={false}
                          showReview={false}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {carousel_style === "style-10" ? (
                  <>
                    <CarouselPrevious className="-left-4 hidden md:flex" />
                    <CarouselNext className="-right-4 hidden md:flex" />
                  </>
                ) : (
                  <div className="mt-8 flex justify-end gap-3 md:absolute md:-top-24 md:right-0">
                    <CarouselPrevious className="static h-14 w-14 translate-y-0 rounded-2xl border-gray-100 bg-white" />
                    <CarouselNext className="static h-14 w-14 translate-y-0 rounded-2xl border-gray-100 bg-white" />
                  </div>
                )}
              </Carousel>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="relative"
                  onClick={() =>
                    !isEditable && onProductClick?.(product.slug || "")
                  }
                >
                  {isEditable && (
                    <div className="absolute inset-0 z-10 bg-transparent" />
                  )}
                  <ProductCard12
                    product={product}
                    siteUser={isEditable ? undefined : siteUser}
                    showPrice={false}
                    showReview={false}
                  />
                </div>
              ))}
            </div>
          ))}

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
