"use client";

import React from "react";
import { ProductCard1 } from "@/components/site-owners/builder/products/product-card1";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/customer/use-wishlist";
import { useAuth } from "@/hooks/customer/use-auth";
import { Loader2, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems, isLoading, error } = useWishlist();

  // Separate mutation hooks
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Handle wishlist toggle
  const handleWishlistToggle = (productId: number, isWishlisted: boolean) => {
    if (isWishlisted) {
      // Adding to wishlist
      addToWishlistMutation.mutate(productId);
    } else {
      // Removing from wishlist - need to find the wishlist item ID
      const wishlistItem = wishlistItems?.find(
        item => item.product.id === productId
      );
      if (wishlistItem) {
        removeFromWishlistMutation.mutate(wishlistItem.id);
      } else {
        console.error(
          "Unable to find wishlist item for product ID:",
          productId
        );
      }
    }
  };

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Sign in to see your wishlist
            </h1>
            <p className="mb-6 text-gray-600">
              Save your favorite rugs and access them from any device
            </p>
            <Link href="/login">
              <Button className="bg-black text-white hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading your wishlist...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Unable to load wishlist
            </h1>
            <p className="mb-6 text-gray-600">
              There was an error loading your wishlist. Please try again.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty wishlist state
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              My Favourites
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600">
              Whether they&apos;re boho, modern, or seasonal, we&apos;re helping
              you keep track of all the rugs you love.
            </p>
          </div>

          {/* Empty State */}
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="mb-6 text-gray-600">
              Start browsing and save your favorite rugs to keep track of them
              here.
            </p>
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-gray-800">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            My Favourites
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Whether they&apos;re boho, modern, or seasonal, we&apos;re helping
            you keep track of all the rugs you love.
          </p>

          {/* Item Count */}
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2">
            <Heart className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"} saved
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {wishlistItems.map(item => {
            // Ensure the product has the is_wishlist flag set to true since it's in wishlist
            const productWithWishlistStatus = {
              ...item.product,
              is_wishlist: true,
            };

            return (
              <ProductCard1
                key={item.product.id}
                product={productWithWishlistStatus}
                onWishlistToggle={handleWishlistToggle}
                showPrice={true}
                showDescription={true}
                showStock={true}
              />
            );
          })}
        </div>

        {/* Loading states for mutations */}
        {(addToWishlistMutation.isPending ||
          removeFromWishlistMutation.isPending) && (
          <div className="mt-8 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-gray-600">
              Updating wishlist...
            </span>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/products">
            <Button
              variant="outline"
              className="border-gray-300 bg-white hover:bg-gray-50"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
