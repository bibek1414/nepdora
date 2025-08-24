import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/owner-site/product";

interface ProductCard3Props {
  product: Product;
  siteId?: string;
}

export const ProductCard3: React.FC<ProductCard3Props> = ({
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
      <Card className="group bg-card transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative h-48 w-48 flex-shrink-0">
              <Image
                src={mockImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {discountPercentage > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-2 left-2 text-xs"
                >
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-foreground text-xl font-semibold">
                    {product.name}
                  </h3>
                  <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                    Stock: {product.stock}
                  </Badge>
                </div>

                <div className="mb-3 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({rating})
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-primary text-2xl font-bold">
                    ${discountedPrice}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-muted-foreground text-lg line-through">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>

                <Button size="sm" disabled={product.stock === 0}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
