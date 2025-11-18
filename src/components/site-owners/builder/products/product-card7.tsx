"use client";

import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { toast } from "sonner";
import Link from "next/link";

interface ProductCard7Props {
  products?: Product[];
  siteUser?: string;
  title?: string;
  subtitle?: string;
}

// Fallback products in case none are provided
const defaultProducts: Product[] = [];

export const ProductCard7: React.FC<ProductCard7Props> = ({
  products = defaultProducts,
  siteUser,
  title = "Best Sellers",
  subtitle = "Our most popular products right now",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Check if product is in wishlist
  const isWishlisted = (productId: number) => {
    return !!wishlistItems?.find(item => item.product.id === productId);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleFavorite = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    try {
      const wishlistItem = wishlistItems?.find(
        item => item.product.id === product.id
      );

      if (wishlistItem) {
        // Remove from wishlist
        await removeFromWishlistMutation.mutateAsync(wishlistItem.id);
      } else {
        // Add to wishlist
        await addToWishlistMutation.mutateAsync(product.id);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  const getDetailsUrl = (product: Product): string => {
    if (siteUser) {
      return `/preview/${siteUser}/products-draft/${product.slug}`;
    } else {
      return `/preview/products-draft/${product.slug}`;
    }
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const filledStars = Math.round(rating || 0);

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

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 360;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Navigation and Carousel */}
        <div className="relative">
          {/* Left Navigation Button */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-lg transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-lg transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-4 sm:px-12"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {products.map(product => {
              const productImage =
                product.thumbnail_image ||
                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";
              const price = parseFloat(product.price || "0");
              const marketPrice = product.market_price
                ? parseFloat(product.market_price)
                : null;
              const discountPercentage =
                marketPrice && marketPrice > price
                  ? Math.round(((marketPrice - price) / marketPrice) * 100)
                  : 0;

              return (
                <Link
                  href={getDetailsUrl(product)}
                  key={product.id}
                  className="w-64 flex-shrink-0 sm:w-72"
                >
                  <div className="group flex h-full cursor-pointer flex-col">
                    {/* Image Container */}
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-neutral-50">
                      {discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 z-20 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                          {discountPercentage}% OFF
                        </div>
                      )}

                      <Image
                        src={productImage}
                        alt={product.thumbnail_alt_description || product.name}
                        fill
                        className="object-contain p-4 transition-opacity group-hover:opacity-90"
                      />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-1 flex-col p-2">
                      <div className="mb-1 flex items-start justify-between">
                        <div>
                          <h3 className="line-clamp-2 h-12 font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <div className="mt-1 flex items-center">
                            <span className="font-medium text-gray-900">
                              ${price.toFixed(2)}
                            </span>
                            {discountPercentage > 0 && (
                              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                {discountPercentage}% OFF
                              </span>
                            )}
                          </div>
                          {marketPrice && marketPrice > price && (
                            <span className="text-xs text-gray-500 line-through">
                              ${marketPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavorite(e, product);
                          }}
                          className={`rounded-full p-1.5 ${isWishlisted(product.id) ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
                          aria-label={
                            isWishlisted(product.id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <Heart
                            className="h-5 w-5"
                            fill={
                              isWishlisted(product.id) ? "currentColor" : "none"
                            }
                            stroke="currentColor"
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="mt-1 flex items-center">
                        <div className="flex">
                          {renderStars(product.average_rating || 0)}
                        </div>
                        {product.reviews_count ? (
                          <span className="ml-1 text-xs text-gray-500">
                            ({product.reviews_count})
                          </span>
                        ) : null}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={e => handleAddToCart(e, product)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard7;
