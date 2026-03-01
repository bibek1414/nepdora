import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
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
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { getProductsBySelection } from "../filter-product";

interface ProductCard6Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
}

export const ProductCard6: React.FC<ProductCard6Props> = ({
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

  // Use actual product data from backend
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const detailsUrl = getDetailsUrl();

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        onClick={e => {
          // If they clicked a button or something interactive inside, don't navigate
          const target = e.target as HTMLElement;
          if (
            target.closest("button") ||
            target.closest("[data-cart-action]") ||
            target.closest("[data-wishlist]")
          )
            return;

          if (siteUser) {
            window.location.href = detailsUrl;
          } else {
            handleClick();
          }
        }}
        className="cursor-pointer"
      >
        {children}
      </div>
    );
  };

  // Check if wishlist operations are loading
  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  // Render star ratings
  const renderStars = () => {
    const stars = [];
    const filledStars = Math.round(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= filledStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-500" />
        );
      }
    }

    return stars;
  };

  return (
    <CardWrapper>
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="rounded bg-green-500 px-2 py-1 text-xs font-bold text-white">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-4 right-4 z-10 h-8 w-8 ${
            isWishlisted
              ? "text-red-500 hover:text-red-600"
              : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
          }`}
          onClick={handleFavorite}
          disabled={isWishlistLoading}
          data-wishlist="true"
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            } ${isWishlistLoading ? "animate-pulse" : ""}`}
          />
        </Button>

        {/* Product Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={productImage}
            alt={product.thumbnail_alt_description || product.name}
            fill
            className="object-contain p-4"
          />
        </div>

        {/* Product details */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-2 flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
            >
              Rs. {Number(price).toLocaleString("en-IN")}
            </span>
            {marketPrice && discountPercentage > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  Rs. {Number(marketPrice).toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-medium text-orange-500">
                  Save Rs. {Number(marketPrice - price).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="mb-2 flex items-center gap-1">
            <div className="flex items-center gap-0.5">{renderStars()}</div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {rating.toFixed(1)}
            </span>
            {reviewsCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({reviewsCount} Sold)
              </span>
            )}
          </div>

          {/* Stock Information */}
          <div className="mb-3">
            {product.stock === 0 ? (
              <span className="text-sm font-medium text-red-500">Sold Out</span>
            ) : product.stock <= 5 ? (
              <span className="text-sm font-medium text-orange-500">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-sm font-medium text-green-500">
                In Stock
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <SOButton
            className="h-auto w-full rounded-lg py-2.5 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
            variant="default"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            data-cart-action="true"
          >
            {product.stock === 0 ? "OUT OF STOCK" : "Add to Cart"}
          </SOButton>
        </div>
      </div>
    </CardWrapper>
  );
};
