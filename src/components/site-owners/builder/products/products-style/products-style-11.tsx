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
import Link from "next/link";
import { EditableLink } from "@/components/ui/editable-link";

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
    title = "Featured Collections",
    subtitle = "Top sale on this week",
    categoryId,
    buttonText = "View All",
    buttonLink = "/products",
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
        <div className="mb-12 flex flex-col items-center justify-center text-center">
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

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-neutral-200 py-20 text-center">
            <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-neutral-200" />
            <h3 className="mb-2 text-xl font-bold text-neutral-400">
              No Products Found
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsStyle11;
