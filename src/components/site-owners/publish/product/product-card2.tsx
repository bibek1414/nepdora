import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/site-owners/button";
import { Button as SOButton } from "@/components/ui/site-owners/button";

import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { toast } from "sonner";

interface ProductCard2Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
}

export const ProductCard2: React.FC<ProductCard2Props> = ({
  product,
  siteUser,
  onClick,
  onWishlistToggle,
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Use actual product data
  const productImage =
    product.thumbnail_image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";
  const price = parseFloat(product.price);
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;

  // Calculate discount if market price exists and is higher than current price
  const discountPercentage =
    marketPrice && marketPrice > price
      ? Math.round(((marketPrice - price) / marketPrice) * 100)
      : 0;

  const discountedPrice = price.toFixed(2);

  // Use real rating data from API
  const rating = product.average_rating || 0;
  const reviewsCount = product.reviews_count || 0;

  // Check if product is in wishlist
  const wishlistItem = wishlistItems?.find(
    item => item.product.id === product.id
  );
  const isWishlisted = !!wishlistItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const detailsUrl = getDetailsUrl();
    window.location.href = detailsUrl;
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    try {
      if (isWishlisted && wishlistItem) {
        // Remove from wishlist
        await removeFromWishlistMutation.mutateAsync(wishlistItem.id);

        // Call the optional callback if provided
        if (onWishlistToggle) {
          onWishlistToggle(product.id, false);
        }
      } else {
        // Add to wishlist
        await addToWishlistMutation.mutateAsync(product.id);

        // Call the optional callback if provided
        if (onWishlistToggle) {
          onWishlistToggle(product.id, true);
        }
      }
    } catch (error) {
      // Error handling is already done in the mutation hooks
      console.error("Wishlist operation failed:", error);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`Quick view: ${product.name}`);
  };

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/products/${product.slug}`;
    } else {
      return `/publish/products/${product.slug}`;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const detailsUrl = getDetailsUrl();

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={detailsUrl}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  // Check if wishlist operations are loading
  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  return (
    <CardWrapper>
      <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative aspect-[4/3]">
              <Image
                src={productImage}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-cover"
                onError={e => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/5" />
            </div>

            {/* Always Visible Actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                size="icon"
                className={`rounded-full bg-white/90 text-gray-800 hover:bg-white ${
                  isWishlisted ? "text-red-500" : ""
                }`}
                onClick={handleFavorite}
                disabled={isWishlistLoading}
                data-wishlist="true"
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""} ${
                    isWishlistLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Corner Badge */}
            <div className="absolute top-4 left-4">
              {discountPercentage > 0 && (
                <div className="bg-black px-3 py-1 text-xs font-bold tracking-wide text-white">
                  SAVE {discountPercentage}%
                </div>
              )}
            </div>

            {/* Stock Status */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge
                  variant="secondary"
                  className="bg-white px-4 py-2 text-sm text-black"
                >
                  SOLD OUT
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-4 p-6">
            {/* Brand/Category */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                {product.category?.name || "Premium Collection"}
              </span>
              {product.stock > 0 && (
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {product.stock > 10 ? "In Stock" : `${product.stock} left`}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h3 className="line-clamp-2 text-xl font-light tracking-tight text-gray-900">
              {product.name}
            </h3>

            {/* Subcategory */}
            {product.sub_category && (
              <div className="text-xs text-gray-500">
                {product.sub_category.name}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">
                ({reviewsCount} review{reviewsCount !== 1 ? "s" : ""})
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* Price Section */}
            <div className="flex items-end justify-between pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">
                    Rs.{Number(discountedPrice).toLocaleString("en-IN")}
                  </span>

                  {marketPrice && discountPercentage > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      Rs.{Number(marketPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Free shipping over $50</p>
              </div>
            </div>

            {/* Action Button */}
            <SOButton
              className="w-full rounded-none border-0 py-6 font-normal tracking-wide text-white hover:bg-gray-800"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-cart-action="true"
              variant="default"
            >
              {product.stock > 0 ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  ADD TO CART
                </>
              ) : (
                "NOTIFY WHEN AVAILABLE"
              )}
            </SOButton>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
