import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, ArrowRight, Clock } from "lucide-react";
import { Product } from "@/types/owner-site/product";

interface ProductCard3Props {
  product: Product;
  siteId?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  onClick?: () => void;
}

export const ProductCard3: React.FC<ProductCard3Props> = ({
  product,
  siteId,
  showPrice = true,
  showDescription = true,
  showStock = true,
  onClick,
}) => {
  // Generate different mock images for variety
  const mockImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
  ];

  const mockImage = mockImages[(product.id + 2) % mockImages.length];
  const price = parseFloat(product.price);
  const discountPercentage = 8 + (product.id % 5) * 4;
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);
  const rating = 4.2 + (product.id % 8) * 0.1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    // Add your cart logic here
    console.log("Added to cart:", product.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to details page using new route structure
    const detailsUrl = getDetailsUrl();
    window.location.href = detailsUrl;
  };

  // Helper function to generate the correct details URL based on route structure
  const getDetailsUrl = (): string => {
    if (siteId) {
      // Nested route: /preview/[siteUser]/products/[id]
      return `/preview/${siteId}/products/${product.id}`;
    } else {
      // Separate route: /preview/products/[id]
      return `/preview/products/${product.id}`;
    }
  };

  // Create the details page URL for the Link component
  const detailsUrl = getDetailsUrl();

  return (
    <Link href={detailsUrl} className="block">
      <Card className="group overflow-hidden border border-gray-200 bg-gradient-to-r from-white to-gray-50 transition-all duration-500 hover:border-gray-300 hover:from-gray-50 hover:to-white hover:shadow-2xl">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="relative flex-shrink-0 overflow-hidden sm:w-64">
              <div className="relative aspect-square sm:h-64">
                <Image
                  src={mockImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 transition-all duration-500 group-hover:to-black/40" />
              </div>

              {/* Corner Accent */}
              <div className={`absolute top-0 left-0 h-16 w-16 opacity-10`}>
                <div
                  className={`absolute top-3 left-3 h-8 w-8 rounded-full opacity-60`}
                ></div>
              </div>

              {/* Site Badge - shows which site this product belongs to */}
              {siteId && (
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="outline"
                    className="border-white/50 bg-white/90 text-xs backdrop-blur-sm"
                  >
                    {siteId}
                  </Badge>
                </div>
              )}

              {/* Floating Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <Badge className={`border-0 text-xs font-bold shadow-lg`}>
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="text-xs shadow-lg">
                    Sold Out
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-white/90 shadow-lg hover:bg-white"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle wishlist logic
                  }}
                >
                  <Heart className="h-4 w-4" />
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
                      <span
                        className={`text-xs font-bold tracking-wider uppercase`}
                      >
                        Featured
                      </span>
                      {showStock && product.stock > 0 && product.stock <= 3 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            Limited Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-gray-700">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Rating and Reviews */}
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
                    ({Math.floor(rating * 25 + 8)} reviews)
                  </span>
                </div>

                {/* Description */}
                {showDescription && (
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
                {showPrice && (
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-3xl font-bold`}>
                          ${discountedPrice}
                        </span>
                        {discountPercentage > 0 && (
                          <span className="text-xl text-gray-400 line-through">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {showStock && (
                        <p className="text-sm text-gray-500">
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    className={`flex-1 py-3 font-semibold text-white transition-all duration-300 group-hover:shadow-lg`}
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock > 0 ? "Add to Cart" : "Notify Me"}
                  </Button>

                  <Button
                    variant="outline"
                    className="px-4 py-3 transition-colors hover:bg-gray-100"
                    onClick={handleViewDetails}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
