import React, { useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag, Check, Plus } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCard11Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
  isEditable?: boolean;
}

export const ProductCard11: React.FC<ProductCard11Props> = ({
  product,
  siteUser,
  onClick,
  isEditable = false,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { addToCart } = useCart();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const productImage =
    product.thumbnail_image || "/fallback/image-not-found.png";
  const price = parseFloat(product.price);
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;
  const rating = product.average_rating || 0;

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/product-details-draft"
      : "/product-details";
    return generateLinkHref(`${basePath}/${product.slug}`, siteUser, pathname);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    setIsAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        isEditable ? "cursor-default" : "cursor-pointer"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative mb-5 aspect-4/3 w-full overflow-hidden rounded-[1.25rem]">
        <div className="relative h-full w-full">
          <Image unoptimized
            src={productImage}
            alt={product.thumbnail_alt_description || product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered && !isEditable ? "scale-105" : ""
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Add to Cart Floating Button */}
        <div
          className={cn(
            "absolute right-3 bottom-11 z-20 translate-y-0 cursor-pointer opacity-100 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-300",
            isHovered && !isEditable ? "sm:translate-y-0 sm:opacity-100" : ""
          )}
        >
          <button
            onClick={handleAddToCart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-300`}
            style={
              {
                backgroundColor:
                  isAdded || isHovered ? theme.colors.primary : "white",
                color: isAdded || isHovered ? "white" : "black",
              } as React.CSSProperties
            }
            title="Add to cart"
            disabled={product.stock === 0}
          >
            {isAdded ? (
              <Check className="h-5 w-5" />
            ) : product.stock === 0 ? (
              <span className="text-[10px] font-bold text-black">SO</span>
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-start justify-between">
          <h3
            className="line-clamp-1 text-[22px] leading-tight font-bold text-black"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {product.name}
          </h3>
          <div className="mt-1 flex shrink-0 items-center gap-1.5 font-medium">
            <Star className="h-4 w-4 fill-[#FF9800] text-[#FF9800]" />
            <span className="text-sm font-medium text-black">
              ({rating.toFixed(1)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-[17px] font-bold text-black"
            style={{ fontFamily: theme.fonts.body }}
          >
            Rs.{Number(price).toLocaleString("en-IN")}
          </span>
          {marketPrice && marketPrice > price && (
            <span className="text-[17px] font-medium text-gray-400 line-through">
              Rs.{Number(marketPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
