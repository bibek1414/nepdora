"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { toast } from "sonner";
import { generateLinkHref } from "@/lib/link-utils";
import { usePathname } from "next/navigation";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCard8Props {
  product: Product;
  siteUser?: string;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
  onClick?: () => void;
}

export const ProductCard8: React.FC<ProductCard8Props> = ({
  product,
  siteUser,
  onWishlistToggle,
  onClick,
}) => {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const { isAuthenticated } = useAuth();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
      secondary: "#facc15",
      text: "#000000",
    },
  };

  const getImageUrl = (img: any) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object") return img.image || img.url || null;
    return null;
  };

  const frontImage = getImageUrl(product.thumbnail_image);
  const price = Number(product.price || 0);
  const marketPrice = product.market_price
    ? Number(product.market_price)
    : null;
  const discountPercentage =
    marketPrice && marketPrice > price
      ? Math.round(((marketPrice - price) / marketPrice) * 100)
      : 0;

  // Wishlist state
  const wishlistItem = wishlistItems?.find(
    (i: any) => i.product?.id === product.id
  );
  const isWishlisted = !!wishlistItem;
  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  const detailsUrl = generateLinkHref(
    `/products/${product.slug}`,
    siteUser,
    pathname
  );

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isWishlisted && wishlistItem) {
        await removeFromWishlistMutation.mutateAsync(wishlistItem.id);
        onWishlistToggle?.(product.id, false);
      } else {
        await addToWishlistMutation.mutateAsync(product);
        onWishlistToggle?.(product.id, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ColorSwatches = useMemo(() => {
    const colors = (product as any).colors || [];
    if (!colors || colors.length === 0) return null;

    return (
      <div className="flex space-x-2">
        {colors.map((c: any, i: number) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="h-4 w-4 cursor-pointer rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  }, [product]);

  return (
    <Card className="w-[260px] overflow-hidden border-none shadow-none transition-shadow duration-200 sm:w-[280px]">
      <Link href={detailsUrl} onClick={onClick}>
        <CardContent className="py-0">
          {/* Image Container */}
          <div className="relative aspect-3/4 h-auto w-full overflow-hidden">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-3 left-3 z-10 bg-black text-white hover:bg-black">
                -{discountPercentage}%
              </Badge>
            )}

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
              disabled={isWishlistLoading}
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={isWishlisted ? "fill-red-500 text-red-500" : ""}
              />
            </Button>

            {/* Product Image */}
            <Image
              src={frontImage}
              alt={product.name || "product"}
              height={400}
              width={400}
              className="h-full w-full object-cover"
            />

            {/* Out of Stock Overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="secondary" className="bg-black/80 text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center space-y-3 p-4">
          {/* Color Swatches */}
          {ColorSwatches}

          {/* Product Title */}
          <h3 className="line-clamp-2 h-10 text-center text-sm font-medium text-gray-900">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              {marketPrice && marketPrice > price && (
                <span className="text-sm text-gray-400 line-through">
                  Rs.{Number(marketPrice).toLocaleString("en-IN")}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                Rs.{Number(price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="mt-2 w-full transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
              disabled={product.stock === 0}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard8;
