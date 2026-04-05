import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { toast } from "sonner";

interface ProductCard11Props {
  product: Product;
  siteUser?: string;
  onClick?: () => void;
}

export const ProductCard11: React.FC<ProductCard11Props> = ({
  product,
  siteUser,
  onClick,
}) => {
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

  const productImage = product.thumbnail_image || "/fallback/image-not-found.png";
  const price = parseFloat(product.price);
  const marketPrice = product.market_price ? parseFloat(product.market_price) : null;
  const rating = product.average_rating || 0;

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/product-details-draft" : "/product-details";
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

  return (
    <div 
      className="flex flex-col group cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="w-full aspect-[4/3] bg-[#F4F5F7] rounded-[1.25rem] overflow-hidden mb-5 p-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="relative w-full h-full">
          <Image
            src={productImage}
            alt={product.thumbnail_alt_description || product.name}
            fill
            className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex justify-between items-start">
          <h3 
            className="text-[22px] font-bold text-gray-900 leading-tight line-clamp-1"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 shrink-0">
            <Star className="w-4 h-4 text-[#FF9800] fill-[#FF9800]" />
            <span className="text-sm font-medium text-gray-700">({rating.toFixed(1)})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span 
            className="text-[17px] font-bold text-gray-900"
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
