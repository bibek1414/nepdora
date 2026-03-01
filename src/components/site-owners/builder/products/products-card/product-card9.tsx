import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/site-owners/button";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { toast } from "sonner";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

interface ProductCard9Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
}

export const ProductCard9: React.FC<ProductCard9Props> = ({
  product,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#000000",
      primary: "#A3E635",
      primaryForeground: "#000000",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Inter",
    },
  };

  const productImage =
    product.thumbnail_image || "/fallback/image-not-found.png";
  const price = parseFloat(product.price);
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;

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

  return (
    <CardWrapper>
      <Card className="group overflow-hidden border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-[#F6F6F6]">
            <Image
              src={productImage}
              alt={product.thumbnail_alt_description || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.stock === 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <Badge variant="secondary" className="text-xs">
                  Sold Out
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <h3
                className="line-clamp-1 text-base font-semibold text-gray-900"
                style={{ fontFamily: theme.fonts.body }}
              >
                {product.name}
              </h3>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ fontFamily: theme.fonts.body }}
              >
                <span className="font-medium text-gray-900">
                  Rs.{" "}
                  {Number(price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {marketPrice && marketPrice > price && (
                  <span className="text-gray-400 line-through">
                    Rs.{" "}
                    {Number(marketPrice).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>

            <Button
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-transparent p-0 hover:border-none!"
              variant="primary"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              data-cart-action="true"
            >
              <img
                src="/images/site-owners/bag.webp"
                alt="bag"
                className="h-auto w-5"
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
