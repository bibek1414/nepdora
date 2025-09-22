import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { toast } from "sonner";

interface ProductCard1Props {
  product: Product;
  siteUser?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  onClick?: () => void;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
}

export const ProductCard1: React.FC<ProductCard1Props> = ({
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

  // Use actual product data instead of mock data
  const productImage =
    product.thumbnail_image ||
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";
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
      return `/preview/${siteUser}/products/${product.slug}`;
    } else {
      return `/preview/products/${product.slug}`;
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
      <Card className="group hover: overflow-hidden border-0 transition-all duration-500 hover:-translate-y-2">
        <CardContent className="p-0">
          {/* Header with gradient */}

          <div className="relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={productImage}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className={`h-8 w-8 transition-colors ${
                  isWishlisted
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-white/90 text-gray-600 hover:bg-white"
                }`}
                onClick={handleFavorite}
                disabled={isWishlistLoading}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""} ${
                    isWishlistLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Sold Out
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge className="text-xs">Only {product.stock} left</Badge>
              )}
              {product.is_featured && (
                <Badge variant="default" className="text-xs">
                  Featured
                </Badge>
              )}
              {product.is_popular && (
                <Badge variant="outline" className="bg-white/90 text-xs">
                  Popular
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4 p-5">
            {/* Category */}
            {product.category && (
              <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {product.category.name}
              </div>
            )}

            {/* Product Title */}
            <h3 className="line-clamp-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-gray-900">
              {product.name}
            </h3>

            {/* Rating - Only show if there are reviews */}
            {reviewsCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  {rating.toFixed(1)} ({reviewsCount} review
                  {reviewsCount !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* No reviews state */}
            {reviewsCount === 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-muted-foreground/30 h-4 w-4"
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  No reviews yet
                </span>
              </div>
            )}

            {/* Description */}
            {showDescription && product.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            {showPrice && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-primary text-2xl font-bold">
                    ${discountedPrice}
                  </span>
                  {marketPrice && discountPercentage > 0 && (
                    <span className="text-sm text-gray-600 line-through">
                      ${marketPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              className="text-primary border-primary/20 hover:bg-primary flex h-10 w-10 transform items-center justify-center rounded-full border bg-white transition-all duration-300 hover:scale-110 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-cart-action="true"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
