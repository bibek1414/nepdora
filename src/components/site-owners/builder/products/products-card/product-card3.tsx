import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, ChevronRight, Clock } from "lucide-react";
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
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ProductCard3Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
}

export const ProductCard3: React.FC<ProductCard3Props> = ({
  product,
  siteUser,
  onClick,
  onWishlistToggle,
}) => {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
      secondary: "#facc15",
      text: "#000000",
    },
  };

  // Use actual product data
  const productImage =
    product.thumbnail_image ||
    "/fallback/image-not-found.png";
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
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }

    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }
    const detailsUrl = getDetailsUrl();
    window.location.href = detailsUrl;
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
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
        await addToWishlistMutation.mutateAsync(product);

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
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/product-details-draft"
      : "/product-details";
    return generateLinkHref(`${basePath}/${product.slug}`, siteUser, pathname);
  };

  const detailsUrl = getDetailsUrl();

  // Check if wishlist operations are loading
  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

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
      className="block cursor-pointer"
    >
      <Card className="overflow-hidden border border-gray-200 bg-linear-to-r from-white to-gray-50">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="relative shrink-0 overflow-hidden sm:w-64">
              <div className="relative aspect-square sm:h-64">
                <Image
                  src={productImage}
                  alt={product.thumbnail_alt_description || product.name}
                  fill
                  className="object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      "/fallback/image-not-found.png";
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/20" />
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 left-0 h-16 w-16 opacity-10">
                <div className="absolute top-3 left-3 h-8 w-8 rounded-full opacity-60"></div>
              </div>

              {/* Site Badge */}
              {siteUser && (
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="outline"
                    className="border-white/50 bg-white/90 text-xs backdrop-blur-sm"
                  >
                    {siteUser}
                  </Badge>
                </div>
              )}

              {/* Floating Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <Badge className="border-0 text-xs font-bold">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Sold Out
                  </Badge>
                )}
              </div>

              {/* Always Visible Wishlist Button */}
              <div className="absolute right-4 bottom-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`rounded-full bg-white/90 hover:bg-white ${
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
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {product.category && (
                        <span className="text-xs font-bold tracking-wider">
                          {product.category.name}
                        </span>
                      )}
                      {product.stock > 0 && product.stock <= 3 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            Limited Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-2xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Rating and Reviews */}
                {reviewsCount > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-600">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({reviewsCount} review{reviewsCount !== 1 ? "s" : ""})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gray-200" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      No reviews yet
                    </span>
                  </div>
                )}

                {/* Subcategory */}
                {product.sub_category && (
                  <div className="text-sm text-gray-500">
                    {product.sub_category.name}
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <p className="line-clamp-3 leading-relaxed text-gray-600">
                    {product.description}
                  </p>
                )}

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Free Shipping
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    30-Day Returns
                  </Badge>
                  {product.stock > 0 && (
                    <Badge variant="outline" className="text-xs">
                      In Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-6 space-y-4">
                {/* Price */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold">
                        Rs.{Number(price).toLocaleString("en-IN")}
                      </span>

                      {marketPrice && discountPercentage > 0 && (
                        <span className="text-xl text-gray-400 line-through">
                          Rs.{Number(marketPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <SOButton
                    variant="default"
                    className="flex-1 py-3 font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                    }}
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                    data-cart-action="true"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock > 0 ? "Add to Cart" : "Notify Me"}
                  </SOButton>

                  <Button
                    variant="outline"
                    className="px-4 py-3 hover:bg-gray-100"
                    onClick={handleViewDetails}
                  >
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
