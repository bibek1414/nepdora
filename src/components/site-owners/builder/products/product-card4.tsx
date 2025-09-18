import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, Eye, Zap } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { toast } from "sonner";

interface ProductCard4Props {
  product: Product;
  siteUser?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  onClick?: () => void;
}

export const ProductCard4: React.FC<ProductCard4Props> = ({
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
    <Link href={detailsUrl} className="">
      <Card className="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-xl">
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
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-xs font-bold text-white">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-white">
                  <Zap className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
              {product.is_popular && (
                <Badge className="bg-purple-500 text-xs font-bold text-white">
                  Popular
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="destructive" className="text-sm font-bold">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={handleViewDetails}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={handleFavorite}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-3 p-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              {product.category && (
                <span className="text-xs font-medium tracking-wide text-blue-600 uppercase">
                  {product.category.name}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-600">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {product.name}
            </h3>

            {/* Subcategory */}
            {product.sub_category && (
              <p className="text-xs text-gray-500">
                {product.sub_category.name}
              </p>
            )}

            {/* Description */}
            {showDescription && product.description && (
              <p className="line-clamp-2 text-xs text-gray-600">
                {product.description}
              </p>
            )}

            {/* Stock Info */}
            {showStock && product.stock > 0 && (
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {product.stock > 10 ? "In Stock" : `${product.stock} left`}
                </span>
              </div>
            )}

            {/* Price Section */}
            {showPrice && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${discountedPrice}
                  </span>
                  {marketPrice && discountPercentage > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ${marketPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-xs font-medium text-green-600">
                    Save ${(marketPrice! - price).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              className="w-full bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-cart-action="true"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock > 0 ? "Add to Cart" : "Notify Me"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
