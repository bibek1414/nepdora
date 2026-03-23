"use client";

import React, { useState } from "react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useWishlist,
  useRemoveFromWishlist,
} from "@/hooks/customer/use-wishlist";
import { Star, Plus, Check, Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ProductCard10Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
  isEditable?: boolean;
}

export const ProductCard10: React.FC<ProductCard10Props> = ({
  product,
  siteUser,
  onClick,
  onWishlistToggle,
  isEditable = false,
}) => {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist, isPending: isAddingToWishlist } =
    useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } =
    useRemoveFromWishlist();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#111827",
      brand600: "#2563EB",
      brand200: "#BFDBFE",
      brand50: "#EFF6FF",
      brand300: "#93C5FD",
    },
  };

  // Normalize fields
  const id = product.id;
  const title = product.name || "Unknown Product";
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price || 0;
  const image = product.thumbnail_image || "/fallback/image-not-found.png";
  const categoryName = product.category?.name || "Uncategorized";
  const rating = product.average_rating || 0;
  const ratingCount = product.reviews_count || 0;
  const originalPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  const slug = product.slug || product.id.toString();

  const [isAdded, setIsAdded] = useState(false);

  // Find if item is in wishlist and get its ID
  const wishlistItem = wishlist?.find(item => item.product.id === id);
  const isInWishlist = !!wishlistItem;
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditable) return;
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }

    addToCart(product, 1);

    // Feedback animation
    setIsAdded(true);
    toast.success(`${title} added to cart`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditable) return;
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }

    if (isInWishlist) {
      if (wishlistItem) {
        removeFromWishlist(wishlistItem.id);
        if (onWishlistToggle) onWishlistToggle(product.id, false);
      }
    } else {
      addToWishlist(product);
      if (onWishlistToggle) onWishlistToggle(product.id, true);
    }
  };

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/product-details-draft"
      : "/product-details";
    return generateLinkHref(`${basePath}/${slug}`, siteUser, pathname);
  };

  const detailsUrl = getDetailsUrl();

  const handleClickWrapper = (e: React.MouseEvent) => {
    if (isEditable) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("[data-cart-action]") ||
      target.closest("[data-wishlist]")
    )
      return;

    if (onClick) {
      onClick();
    } else if (siteUser) {
      window.location.href = detailsUrl;
    } else {
      window.location.href = detailsUrl;
    }
  };

  return (
    <div
      onClick={handleClickWrapper}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200"
    >
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <span className="rounded bg-green-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 z-20 flex translate-x-12 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <button
          onClick={handleWishlist}
          data-wishlist="true"
          disabled={isWishlistLoading}
          className={`rounded-full p-2 shadow-md transition-all duration-200 ${isInWishlist ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"} ${isWishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
          title={isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        >
          <Heart size={16} className={isInWishlist ? "fill-current" : ""} />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white p-6">
        <div className="relative block h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="transform object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex grow flex-col border-t border-gray-50 bg-white p-4">
        <div className="mb-1 w-fit text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          {categoryName}
        </div>

        <div className="mb-2 block">
          <h3
            className="line-clamp-2 h-10 text-sm leading-snug font-medium text-gray-900 transition-colors group-hover:opacity-80"
            title={title}
          >
            {title}
          </h3>
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({ratingCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-bold text-gray-900">
              Rs.{price.toLocaleString("en-IN")}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-xs text-gray-400 line-through decoration-gray-300">
                Rs.{originalPrice.toLocaleString("en-IN")}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            data-cart-action="true"
            className={`flex shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
              isAdded
                ? "border-green-600 bg-green-600 text-white"
                : "bg-white hover:bg-gray-50"
            } ${isEditable ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isEditable || product.stock === 0}
          >
            {isAdded ? (
              <>
                <Check size={14} /> ADDED
              </>
            ) : product.stock > 0 ? (
              <>
                <Plus size={14} /> ADD
              </>
            ) : (
              "OUT OF STOCK"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
