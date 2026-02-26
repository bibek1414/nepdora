"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/owner-site/admin/product";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Badge } from "@/components/ui/badge";

interface ProductCard7Props {
  products?: Product[];
  siteUser?: string;
  title?: string;
  subtitle?: string;
  onTitleChange?: (title: string) => void;
  onSubtitleChange?: (subtitle: string) => void;
  isEditable?: boolean;
}

const defaultProducts: Product[] = [];

export const ProductCard7: React.FC<ProductCard7Props> = ({
  products = defaultProducts,
  siteUser,
  title = "Best Sellers",
  subtitle = "Our most popular products right now",
  isEditable = false,
}) => {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isScrollingRef = useRef(false);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      text: "#0F172A",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };

  // Create infinite loop by repeating products multiple times for seamless scrolling
  const infiniteProducts = [
    ...products,
    ...products,
    ...products,
    ...products,
    ...products,
  ];

  const getDetailsUrl = (product: Product): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/product-details-draft"
      : "/product-details";
    return generateLinkHref(`${basePath}/${product.slug}`, siteUser, pathname);
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || products.length === 0) return;

    // Start at the middle set of products
    const cardWidth = 288;
    const gap = 24;
    const scrollToMiddle = (cardWidth + gap) * products.length * 2;
    container.scrollLeft = scrollToMiddle;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollPos = container.scrollLeft;
      const totalProductWidth = (cardWidth + gap) * products.length;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // If scrolled too far left, jump forward
      if (scrollPos < totalProductWidth) {
        isScrollingRef.current = true;
        container.scrollLeft = scrollPos + totalProductWidth * 2;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }

      // If scrolled too far right, jump backward
      if (scrollPos > totalProductWidth * 3) {
        isScrollingRef.current = true;
        container.scrollLeft = scrollPos - totalProductWidth * 2;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }

      checkScroll();
    };

    checkScroll();
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products.length]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container || products.length === 0) return;

    const cardWidth = 288;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    const newScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          {/* Left Navigation Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-lg transition-all hover:bg-black hover:text-white"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-lg transition-all hover:bg-black hover:text-white"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-4 sm:px-12"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {infiniteProducts.map((product, index) => {
              const productImage =
                product.thumbnail_image ||
                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";
              const price = parseFloat(product.price || "0");
              const marketPrice = product.market_price
                ? parseFloat(product.market_price)
                : null;
              const discountPercentage =
                marketPrice && marketPrice > price
                  ? Math.round(((marketPrice - price) / marketPrice) * 100)
                  : 0;

              return (
                <Link
                  href={getDetailsUrl(product)}
                  key={`${product.id}-${index}`}
                  className="w-64 shrink-0 sm:w-72"
                >
                  <div className="group flex h-full cursor-pointer flex-col">
                    {/* Image Container */}
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-neutral-50">
                      {discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 z-20 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
                          {discountPercentage}% OFF
                        </div>
                      )}
                      <Image
                        src={productImage}
                        alt={product.thumbnail_alt_description || product.name}
                        fill
                        className="object-contain p-4 transition-opacity group-hover:opacity-90"
                      />
                    </div>

                    {/* Product Name & Price */}
                    <div className="flex flex-col items-center p-2">
                      <h3
                        className="mb-1 text-center font-medium text-gray-900"
                        style={{ fontFamily: theme.fonts.heading }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className="text-lg font-bold"
                          style={{ color: theme.colors.primary }}
                        >
                          Rs.{Number(price).toLocaleString("en-IN")}
                        </span>
                        {marketPrice && marketPrice > price && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs.{Number(marketPrice).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard7;
