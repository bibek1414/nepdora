"use client";
import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard6 } from "../products-card/product-card6";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
    title = "Best Selling",
    subtitle = "Our most popular items this week",
    categoryId,
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
  } = useProducts({
    is_popular: true,
    category_id: categoryId,
    page_size: 12,
  });

  const products = productsData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-neutral-50 py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <div className="space-y-2">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-3xl font-black text-black uppercase italic md:text-5xl"
              style={{ fontFamily: theme.fonts.heading }}
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="mx-auto max-w-2xl text-neutral-500"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          </div>
          <div className="mt-8 h-[2px] w-24 bg-black/10" />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-4 rounded-2xl bg-white p-4"
              >
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="mx-auto h-4 w-1/2" />
                <Skeleton className="mx-auto h-6 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Best Sellers</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load best selling products."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="relative">
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
                      <ProductCard6
                        product={product}
                        siteUser={isEditable ? undefined : siteUser}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 bg-white/80 shadow-md hover:bg-white md:-left-12" />
              <CarouselNext className="-right-4 bg-white/80 shadow-md hover:bg-white md:-right-12" />
            </Carousel>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-neutral-200 py-20 text-center">
            <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-neutral-200" />
            <h3 className="mb-2 text-xl font-bold text-neutral-400">
              No Best Sellers Found
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsStyle10;
