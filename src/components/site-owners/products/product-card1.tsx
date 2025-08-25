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

  // Generate different mock images based on product ID for variety
  const mockImages = [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  ];

  const mockImage = mockImages[product.id % mockImages.length];
  const price = parseFloat(product.price);
  const discountPercentage = 10 + (product.id % 3) * 5; // Variable discount based on product ID
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);
  const rating = 4.0 + (product.id % 10) * 0.1; // Variable rating

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();

    // Add to cart with quantity of 1
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to details page using new route structure
    const detailsUrl = getDetailsUrl();
    window.location.href = detailsUrl;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your favorite logic here
    toast.info(`${product.name} added to favorites!`);
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to product details
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  // Create the details page URL for the Link component
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
      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <CardContent className="p-0">
          {/* Colorful Header with Gradient */}
          <div className={`bg-primary h-2`}></div>

          <div className="relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={mockImage}
                alt={product.name}
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
                className="h-8 w-8 bg-white/90 shadow-lg hover:bg-white"
                onClick={handleFavorite}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge
                  variant="destructive"
                  className="text-xs font-bold shadow-lg"
                >
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="text-xs shadow-lg">
                  Sold Out
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge className={`text-xs shadow-lg`}>
                  Only {product.stock} left
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4 p-5">
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
            {showDescription && (
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
                  {discountPercentage > 0 && (
                    <span className="text-muted-foreground text-sm line-through">
                      ${price.toFixed(2)}
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
              className={`w-full font-semibold text-white transition-all duration-300`}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
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
