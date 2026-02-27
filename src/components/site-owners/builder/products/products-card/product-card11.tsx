"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Star } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { toast } from "sonner";

interface ProductCard11Props {
  product: Product;
  siteUser?: string;
}

export const ProductCard11: React.FC<ProductCard11Props> = ({
  product,
  siteUser,
}) => {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#111827",
      primaryForeground: "#FFFFFF",
    },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }

    addToCart(product, 1);
    setIsAdded(true);

    // Optional: Open side drawer automatically like in your example

    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const detailsUrl = generateLinkHref(
    `${pathname?.includes("/preview/") ? "/product-details-draft" : "/product-details"}/${product.slug}`,
    siteUser,
    pathname
  );

  return (
    <div
      onClick={e => {
        const target = e.target as HTMLElement;
        if (
          target.closest("button") ||
          target.closest("a") ||
          target.closest("[data-cart-action]") ||
          target.closest("[data-wishlist]")
        )
          return;
        window.location.href = detailsUrl;
      }}
      className="group block h-full cursor-pointer"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image - Taller aspect ratio [3/4] as requested */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
          <Image
            src={product.thumbnail_image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col px-3 pb-3 md:px-4 md:pb-4">
          <div className="mt-3 flex-1 md:mt-5">
            {/* Product Name */}
            <h3
              className="line-clamp-2 text-sm leading-snug font-semibold text-gray-900 md:text-base"
              style={{ color: theme.colors.primary }}
            >
              {product.name}
            </h3>

            {/* Price */}
            <p className="mt-1 text-xs font-light text-gray-600 md:text-sm">
              Rs. {Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          {/* CTA Button - Rounded Full */}
          <div className="mt-4 md:mt-6">
            <button
              onClick={handleAddToCart}
              disabled={isAdded || product.stock === 0}
              className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all active:scale-95 disabled:opacity-50 md:py-2.5 md:text-sm"
              style={{
                backgroundColor: isAdded ? "#10B981" : theme.colors.primary,
                color: theme.colors.primaryForeground || "#fff",
              }}
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
