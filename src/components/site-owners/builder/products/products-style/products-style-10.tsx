"use client";

import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard2 } from "../products-card/product-card2";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
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

export const ProductsStyle10: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const {
    title = "Featured Products",
    categoryId,
    display_type = "carousel",
    carousel_style = "style-5",
  } = data || {};

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useProducts({
    category_id: categoryId,
    page_size: 20,
  });

  const products = productsData?.results || [];

  const handleUpdate =
    (field: keyof ProductsComponentData["data"]) => (value: string | any) => {
      onUpdate?.({ [field]: value });
    };

  return (
    <div className="overflow-hidden bg-white px-2 py-12">
      <div className="container mx-auto mb-12 max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <EditableText
              value={title}
              onChange={handleUpdate("title")}
              as="h2"
              className="text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              isEditable={isEditable}
            />
          </div>
          {display_type === "carousel" && carousel_style === "style-5" && (
            <div className="hidden gap-3 md:flex">
              {/* Navigation will be rendered inside the Carousel component below but positioned here via absolute positioning */}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {isLoading && (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] w-[300px] shrink-0 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Products</AlertTitle>
              <AlertDescription>Failed to load products.</AlertDescription>
            </Alert>
          </div>
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
                  {products.map(product => (
                    <CarouselItem
                      key={product.id}
                      className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <ProductCard2
                        product={product}
                        siteUser={isEditable ? undefined : siteUser}
                        onClick={() =>
                          !isEditable && onProductClick?.(product.slug || "")
                        }
                      />
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
                    <CarouselPrevious className="static h-14 w-14 translate-y-0 rounded-2xl border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" />
                    <CarouselNext className="static h-14 w-14 translate-y-0 rounded-2xl border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" />
                  </div>
                )}
              </Carousel>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <div key={product.id}>
                  <ProductCard2
                    product={product}
                    siteUser={isEditable ? undefined : siteUser}
                    onClick={() =>
                      !isEditable && onProductClick?.(product.slug || "")
                    }
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

        <FeaturedProductsButton isEditable={isEditable} />
      </div>
    </div>
  );
};

export default ProductsStyle10;
