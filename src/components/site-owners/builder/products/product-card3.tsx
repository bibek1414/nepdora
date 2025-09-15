import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, ArrowRight, Clock } from "lucide-react";
import { Product } from "@/types/owner-site/product";
import { useCart } from "@/hooks/owner-site/use-cart";
import { toast } from "sonner";

interface ProductCard3Props {
  product: Product;
  siteUser?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  onClick?: () => void;
}

export const ProductCard3: React.FC<ProductCard3Props> = ({
  product,
  siteUser,
  showPrice = true,
  showDescription = true,
  showStock = true,
  onClick,
}) => {
  const { addToCart } = useCart();

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

  // Generate a rating (this could be replaced with actual rating from API)
  const rating = 4.2 + (product.id % 8) * 0.1;

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

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`${product.name} added to favorites!`);
  };

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/preview/${siteUser}/products/${product.slug}`;
    } else {
      return `/preview/products/${product.slug}`;
    }
  };

  const detailsUrl = getDetailsUrl();

  return (
    <Link href={detailsUrl} className="block">
      <Card className="group hover: overflow-hidden border border-gray-200 bg-gradient-to-r from-white to-gray-50 transition-all duration-500 hover:border-gray-300 hover:from-gray-50 hover:to-white">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="relative flex-shrink-0 overflow-hidden sm:w-64">
              <div className="relative aspect-square sm:h-64">
                <Image
                  src={productImage}
                  alt={product.thumbnail_alt_description || product.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  onError={e => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 transition-all duration-500 group-hover:to-black/40" />
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
                {product.is_featured && (
                  <Badge className="border-0 bg-yellow-500 text-xs font-bold text-black">
                    Featured
                  </Badge>
                )}
                {product.is_popular && (
                  <Badge
                    variant="outline"
                    className="border-red-500 bg-white/90 text-xs text-red-600"
                  >
                    Popular
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-white/90 hover:bg-white"
                  onClick={handleFavorite}
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
                      {product.category && (
                        <span className="text-xs font-bold tracking-wider uppercase">
                          {product.category.name}
                        </span>
                      )}
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

                {/* Subcategory */}
                {product.sub_category && (
                  <div className="text-sm text-gray-500">
                    {product.sub_category.name}
                  </div>
                )}

                {/* Description */}
                {showDescription && product.description && (
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
                  {product.is_featured && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500 text-xs text-yellow-600"
                    >
                      Featured Product
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
                        <span className="text-3xl font-bold">
                          ${discountedPrice}
                        </span>
                        {marketPrice && discountPercentage > 0 && (
                          <span className="text-xl text-gray-400 line-through">
                            ${marketPrice.toFixed(2)}
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
                    className="group-hover: flex-1 py-3 font-semibold text-white transition-all duration-300"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                    data-cart-action="true"
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
