import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Product } from "@/types/owner-site/product";

interface ProductCard2Props {
  product: Product;
  siteId?: string;
}

export const ProductCard2: React.FC<ProductCard2Props> = ({
  product,
  siteId,
}) => {
  const mockImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop";
  const price = parseFloat(product.price);
  const discountPercentage = 15;
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);
  const rating = 4.5;

  const CardWrapper = siteId
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={`/preview?site=${siteId}&product=${product.id}`}>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <CardWrapper>
      <Card className="group border-border/50 hover:border-primary/50 bg-card overflow-hidden border transition-all duration-300">
        <CardContent className="p-0">
          <div className="bg-muted/30 relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={mockImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs font-medium">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-5">
            <div className="mb-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground ml-2 text-xs">
                ({rating})
              </span>
            </div>

            <h3 className="text-foreground mb-2 line-clamp-1 text-lg font-semibold">
              {product.name}
            </h3>

            <p className="text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem] text-sm">
              {product.description}
            </p>

            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
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
                <div className="text-muted-foreground text-xs">
                  Stock: {product.stock}
                </div>
              </div>
            </div>

            <Button className="w-full" size="sm" disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
