import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, Eye, Zap } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { toast } from "sonner";
import { Button as SOButton } from "@/components/ui/site-owners/button";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ProductCard4Props {
  product: Product;
  siteUser?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  onClick?: () => void;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
}

export const ProductCard4: React.FC<ProductCard4Props> = ({
  product,
  siteUser,
  showPrice = true,
  showDescription = true,
  showStock = true,
  onClick,
  onWishlistToggle,
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Use actual product data
  const productImage =
    product.thumbnail_image ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
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

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/products/${product.slug}`;
    } else {
      return `/publish/products/${product.slug}`;
    }
  };

  const detailsUrl = getDetailsUrl();

  // Check if wishlist operations are loading
  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  return (
    <Link href={detailsUrl} className="block">
      <Card className="group relative overflow-hidden border border-gray-200 bg-white py-0 transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={productImage}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent transition-all duration-300" />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <Badge
                  variant="destructive"
                  className="px-2 py-1 text-[11px] font-semibold"
                >
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className={`h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white ${
                  isWishlisted ? "text-red-500" : "text-gray-600"
                }`}
                onClick={handleFavorite}
                disabled={isWishlistLoading}
                data-wishlist="true"
              >
                <Heart
                  className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""} ${
                    isWishlistLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-2 p-3">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              {product.category && (
                <span
                  className="text-[10px] font-medium tracking-wider uppercase opacity-70"
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  {product.category.name}
                </span>
              )}
              {reviewsCount > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-medium text-gray-500">
                    {rating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 text-gray-300" />
                  <span className="text-[10px] font-medium text-gray-400">
                    No reviews
                  </span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <h3 className="line-clamp-2 text-xs leading-tight font-medium text-gray-900">
              {product.name}
            </h3>

            {/* Subcategory */}
            {product.sub_category && (
              <p className="text-[10px] font-normal text-gray-400">
                {product.sub_category.name}
              </p>
            )}

            {/* Description */}
            {showDescription && product.description && (
              <p className="line-clamp-2 text-[10px] leading-relaxed text-gray-500">
                {product.description}
              </p>
            )}

            {/* Stock Info */}
            {showStock && product.stock > 0 && (
              <div className="flex items-center gap-1">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-[10px] font-normal text-gray-400">
                  {product.stock > 10 ? "In Stock" : `${product.stock} left`}
                </span>
              </div>
            )}

            {/* Price Section */}
            {showPrice && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-gray-900">
                    Rs.{Number(discountedPrice).toLocaleString("en-IN")}
                  </span>

                  {marketPrice && discountPercentage > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      Rs.{Number(marketPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && marketPrice !== null && (
                  <p className="text-[10px] font-medium text-green-600">
                    Save Rs.
                    {Number(marketPrice - price).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <SOButton
              className="w-full py-2 text-[11px] font-medium text-white transition-all duration-200"
              disabled={product.stock === 0}
              variant="default"
              onClick={handleAddToCart}
              data-cart-action="true"
            >
              <ShoppingCart className="mr-1.5 h-3 w-3" />
              {product.stock > 0 ? "Add to Cart" : "Notify Me"}
            </SOButton>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
