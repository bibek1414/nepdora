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

export const ProductsStyle6: React.FC<ProductsStyleProps> = ({
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
        <div className="mb-12 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-center text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-center text-xl"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
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
            <CarouselPrevious className="left-2 bg-white/80 shadow-md hover:bg-white" />
            <CarouselNext className="right-2 bg-white/80 shadow-md hover:bg-white" />
          </Carousel>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No Products Found
            </h3>
            <p className="text-muted-foreground">
              Add some products to your inventory to display them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
