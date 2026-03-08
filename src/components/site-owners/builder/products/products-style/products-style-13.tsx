"use client";

import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard10 } from "../products-card/product-card10";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ProductsStyleProps {
  data: ProductsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ProductsComponentData["data"]>) => void;
  onProductClick?: (productslug: string) => void;
}

export const ProductsStyle13: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { title = "Featured Products", categoryId } = data || {};

  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    category_id: categoryId,
    page_size: 10,
  });

  const products = productsData?.results || [];

  const handleUpdate =
    (field: keyof ProductsComponentData["data"]) => (value: string | any) => {
      onUpdate?.({ [field]: value });
    };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="overflow-hidden bg-white px-2">
      <div className="container mx-auto mb-12 max-w-7xl px-4 py-8">
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
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white transition-all"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="container mx-auto flex max-w-7xl snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[420px] w-[300px] shrink-0 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}

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
          products.map(product => (
            <div
              key={product.id}
              className="h-auto w-[300px] shrink-0 snap-start"
            >
              <ProductCard10
                product={product}
                siteUser={isEditable ? undefined : siteUser}
                onClick={() =>
                  !isEditable && onProductClick?.(product.slug || "")
                }
              />
            </div>
          ))}

        {!isLoading && !error && products.length === 0 && (
          <div className="w-full rounded-3xl border-2 border-dashed border-neutral-200 py-20 text-center">
            <ShoppingBag className="mx-auto mb-6 h-12 w-12 text-neutral-200" />
            <h3 className="text-lg font-bold text-neutral-400">
              No Products Found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};
