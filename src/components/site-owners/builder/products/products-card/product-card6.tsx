"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import Link from "next/link";
import Image from "next/image";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { cn } from "@/lib/utils";

interface ProductCard6Props {
  product: Product;
  index?: number;
  siteUser?: string;
  isEditable?: boolean;
}

export const ProductCard6 = ({
  product,
  index = 0,
  siteUser,
  isEditable = false,
}: ProductCard6Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const wishlistItem = useMemo(
    () => wishlist?.find(item => item.product.id === product.id),
    [wishlist, product.id]
  );

  const isWishlisted = !!wishlistItem;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEditable) return;

    if (isWishlisted) {
      if (wishlistItem) {
        removeFromWishlist(wishlistItem.id);
      }
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEditable) return;

    addToCart(product, 1);
    toast.success("Added to bag", {
      description: `${product.name} added to your bag.`,
    });
  };

  const price = parseFloat(product.price);
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;
  const discount =
    marketPrice && marketPrice > price
      ? Math.round(((marketPrice - price) / marketPrice) * 100)
      : null;

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/product-details-draft"
      : "/product-details";
    const slug = product.slug || product.id.toString();
    return generateLinkHref(`${basePath}/${slug}`, siteUser, pathname);
  };

  const productUrl = getDetailsUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(isEditable ? "cursor-default" : "cursor-pointer")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-3">
        {/* Image Container */}
        <Link href={isEditable ? "#" : productUrl} className="block">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <motion.div
              className="relative h-full w-full"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image unoptimized
                src={product.thumbnail_image || "/fallback/image-not-found.png"}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Discount Badge */}
            {discount && (
              <span className="bg-foreground text-background absolute top-3 left-3 z-10 rounded-lg px-2 py-1 text-xs font-medium">
                -{discount}%
              </span>
            )}

            {/* Popular Badge */}
            {product.is_popular && (
              <span
                className={`absolute ${discount ? "top-10" : "top-3"} left-3 z-10 rounded-lg bg-rose-500 px-2 py-1 text-xs font-medium text-white`}
              >
                Popular
              </span>
            )}

            {/* Wishlist Button */}
            {!isEditable && (
              <button
                onClick={handleWishlistClick}
                className={`absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isWishlisted
                    ? "bg-foreground text-background"
                    : "text-foreground bg-white/80 backdrop-blur-sm hover:bg-white"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            )}

            {/* Add to Cart Button */}
            {!isEditable && (
              <motion.button
                onClick={handleAddToCart}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                transition={{ duration: 0.2 }}
                className="bg-foreground text-background absolute right-3 bottom-3 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
              >
                <Plus className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </Link>

        <div className="block space-y-1">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              {product.category?.name || "\u00A0"}
            </p>
            {product.average_rating ? (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {product.average_rating}
                </span>
                {product.reviews_count ? (
                  <span className="text-muted-foreground text-xs">
                    ({product.reviews_count})
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <Link href={isEditable ? "#" : productUrl}>
            <h3
              className={cn(
                "text-foreground line-clamp-2 text-sm leading-snug font-medium transition-colors",
                isHovered && !isEditable ? "text-muted-foreground" : ""
              )}
            >
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-bold text-gray-900">
              Rs.{price.toLocaleString("en-IN")}
            </span>
            {marketPrice && marketPrice > price && (
              <span className="text-muted-foreground text-sm line-through">
                Rs.{marketPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
