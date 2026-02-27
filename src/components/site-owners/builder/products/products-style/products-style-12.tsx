"use client";

import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard11 } from "../products-card/product-card11";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight, ShoppingBag } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableLink } from "@/components/ui/editable-link";

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
    title = "New Arrivals",
    subtitle = "Discover the latest additions to our collection",
    categoryId,
    buttonText = "View All Products",
    buttonLink = "/products",
  } = data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#111827",
      secondary: "#6B7280",
      background: "#FFFFFF",
    },
  };

  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    category_id: categoryId,
    page_size: 4,
  });

  const products = productsData?.results || [];

  const handleUpdate =
    (field: keyof ProductsComponentData["data"]) => (value: string | any) => {
      onUpdate?.({ [field]: value });
    };

  const handleLinkChange = (newText: string, newLink: string) => {
    onUpdate?.({ buttonText: newText, buttonLink: newLink });
  };

  return (
    <section className="border-b border-gray-50 bg-white py-12 last:border-0 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end md:gap-6">
          <div>
            <EditableText
              value={subtitle}
              onChange={handleUpdate("subtitle")}
              as="span"
              isEditable={isEditable}
            />

            <EditableText
              value={title}
              onChange={handleUpdate("title")}
              as="h4"
              style={{ color: theme.colors.primary }}
              isEditable={isEditable}
            />
          </div>

          <EditableLink
            href={buttonLink}
            text={buttonText}
            onChange={handleLinkChange}
            isEditable={isEditable}
            siteUser={siteUser}
            className="group flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80 md:text-base"
            style={{ color: theme.colors.primary }}
          >
            {buttonText || "View All Products"}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
          </EditableLink>
        </div>

        {/* Product Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-2xl bg-gray-100 md:h-[420px]"
              />
            ))}

          {error && (
            <div className="col-span-2 lg:col-span-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Products</AlertTitle>
                <AlertDescription>Failed to load products.</AlertDescription>
              </Alert>
            </div>
          )}

          {!isLoading &&
            !error &&
            products.map(product => (
              <div
                key={product.id}
                onClick={() =>
                  !isEditable && onProductClick?.(product.slug || "")
                }
                className={isEditable ? "" : "cursor-pointer"}
              >
                <ProductCard11
                  product={product}
                  siteUser={isEditable ? undefined : siteUser}
                />
              </div>
            ))}

          {!isLoading && !error && products.length === 0 && (
            <div className="col-span-2 rounded-3xl border-2 border-dashed border-neutral-200 py-20 text-center lg:col-span-4">
              <ShoppingBag className="mx-auto mb-6 h-12 w-12 text-neutral-200" />
              <h3 className="text-lg font-bold text-neutral-400">
                No Products Found
              </h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
