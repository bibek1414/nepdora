"use client";
import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard9 } from "../products-card/product-card9";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { FeaturedProductsButton } from "../featured-products-button";
import { EditableLink } from "@/components/ui/editable-link";
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

export const ProductsStyle4: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const {
    title = "Featured Collections",
    subtitle = "Top sale on this week",
    categoryId,
    buttonText = "View All",
    buttonLink = "/products",
    display_type = "grid",
    carousel_style = "style-10",
  } = data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#A3E635",
      text: "#000000",
      background: "#FFFFFF",
    },
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
    page_size: 6,
  });

  const products = productsData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleLinkChange = (newText: string, newLink: string) => {
    onUpdate?.({ buttonText: newText, buttonLink: newLink });
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="mb-6 inline-block">
              <EditableText
                value={subtitle || "Top sale on this week"}
                onChange={handleSubtitleChange}
                as="span"
                isEditable={isEditable}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-black"
                style={{ backgroundColor: theme.colors.primary || "#B9FF66" }}
                placeholder="Enter subtitle..."
              />
            </div>

            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl"
              style={{ fontFamily: theme.fonts.heading }}
              isEditable={isEditable}
              placeholder="Enter title..."
            />
          </div>
          {display_type === "carousel" && carousel_style === "style-5" && (
            <div className="flex gap-3 self-center md:self-end">
              {/* Navigation will be rendered inside the Carousel component below */}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
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
          <>
            {display_type === "carousel" ? (
              <div className={`relative ${carousel_style === "style-10" ? "px-12" : ""}`}>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-8">
                    {products.map(product => (
                      <CarouselItem
                        key={product.id}
                        className="pl-8 sm:basis-1/2 lg:basis-1/3"
                      >
                        <div
                          onClick={() =>
                            !isEditable && onProductClick?.(product.slug || "")
                          }
                          className={isEditable ? "" : "cursor-pointer"}
                        >
                          <ProductCard9
                            product={product}
                            siteUser={isEditable ? undefined : siteUser}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {carousel_style === "style-10" ? (
                    <>
                      <CarouselPrevious className="hidden md:flex -left-4" />
                      <CarouselNext className="hidden md:flex -right-4" />
                    </>
                  ) : (
                    <div className="mt-8 flex justify-end gap-3 md:absolute md:-top-24 md:right-0">
                      <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-gray-100 bg-white" />
                      <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-gray-100 bg-white" />
                    </div>
                  )}
                </Carousel>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                  <div
                    key={product.id}
                    onClick={() =>
                      !isEditable && onProductClick?.(product.slug || "")
                    }
                    className={isEditable ? "" : "cursor-pointer"}
                  >
                    <ProductCard9
                      product={product}
                      siteUser={isEditable ? undefined : siteUser}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-16 flex justify-center">
              <EditableLink
                href={buttonLink}
                text={buttonText}
                onChange={handleLinkChange}
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-black bg-white px-8 py-3 text-base font-medium text-black transition-colors hover:bg-black hover:text-white"
                style={{ fontFamily: theme.fonts.body }}
              />
            </div>
          </>
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

export default ProductsStyle4;
