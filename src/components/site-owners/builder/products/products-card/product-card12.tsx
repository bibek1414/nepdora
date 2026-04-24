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

interface ProductCard12Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
  isEditable?: boolean;
  showPrice?: boolean;
  showReview?: boolean;
}

export const ProductCard12: React.FC<ProductCard12Props> = ({
  product,
  siteUser,
  onClick,
  isEditable = false,
  showPrice = true,
  showReview = false,
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
    if (isEditable) return;

    addToCart(product, 1);
    setIsAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

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
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300",
        isEditable
          ? "cursor-default"
          : "hover:-xl hover:-blue-500/5 cursor-pointer hover:-translate-y-1"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden p-4">
        <div className="relative h-full w-full">
          <Image
            unoptimized
            src={productImage}
            alt={product.thumbnail_alt_description || product.name}
            fill
            className={cn(
              "object-contain mix-blend-multiply transition-transform duration-700 ease-out",
              isHovered && !isEditable ? "scale-110" : ""
            )}
          />
        </div>

        {/* Discount Badge */}
        {marketPrice && marketPrice > price && (
          <div className="-sm absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            {Math.round(((marketPrice - price) / marketPrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex grow flex-col p-4">
        <h3
          className="line-clamp-2 min-h-[40px] text-[15px] leading-tight font-semibold text-gray-900 transition-colors"
          style={{ fontFamily: theme.fonts.heading }}
        >
          {product.name}
        </h3>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {showPrice && price > 0 && (
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[17px] font-bold text-gray-900"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    Rs.{Number(price).toLocaleString("en-IN")}
                  </span>
                  {marketPrice && marketPrice > price && (
                    <span className="text-xs font-medium text-gray-400 line-through">
                      Rs.{Number(marketPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Add to Cart Action */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isEditable}
              className={cn(
                "flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all duration-300 border",
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-white text-black hover:scale-105 hover:bg-gray-200 active:scale-95",
                isEditable && "cursor-not-allowed opacity-50",
                product.stock === 0 &&
                  "cursor-not-allowed bg-gray-200 text-gray-500"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  ADDED
                </>
              ) : product.stock === 0 ? (
                "OUT OF STOCK"
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  ADD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
