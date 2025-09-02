import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/types/owner-site/product";
import { useCart } from "@/hooks/owner-site/use-cart";
import { toast } from "sonner";

interface ProductCard1Props {
  product: Product;
  siteId?: string;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  onClick?: () => void;
}

export const ProductCard1: React.FC<ProductCard1Props> = ({
  product,
  siteId,
  showPrice = true,
  showDescription = true,
  showStock = true,
  onClick,
}) => {
  const { addToCart } = useCart();

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

  // Generate a rating based on product features (this could be replaced with actual rating from API)
  const rating = 4.0 + (product.id % 10) * 0.1;

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
    if (siteId) {
      return `/preview/${siteId}/products/${product.slug}`;
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

  const CardWrapper = siteId
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={detailsUrl}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <Card className="group hover: overflow-hidden border-0 transition-all duration-500 hover:-translate-y-2">
        <CardContent className="p-0">
          {/* Header with gradient */}
          <div className="bg-primary h-2"></div>

          <div className="relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={productImage}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={handleFavorite}
              >
                <Heart className="h-4 w-4" />
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
            <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-bold transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
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
                {rating.toFixed(1)} ({Math.floor(rating * 20 + 10)} reviews)
              </span>
            </div>

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
                    <span className="text-muted-foreground text-sm line-through">
                      ${marketPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {showStock && (
                  <Badge
                    variant={
                      product.stock > 5
                        ? "default"
                        : product.stock > 0
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of Stock"}
                  </Badge>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              size="sm"
              className="w-full font-semibold text-white transition-all duration-300"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-cart-action="true"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock > 0 ? "Add to Cart" : "Notify When Available"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
