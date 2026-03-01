import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Tag } from "lucide-react";
import { SubCategory } from "@/types/owner-site/admin/product";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface SubCategoryCard2Props {
  subcategory: SubCategory;
  siteUser?: string;
  onClick?: () => void;
}
export const SubCategoryCard3: React.FC<SubCategoryCard2Props> = ({
  subcategory,
  siteUser,
  onClick,
}) => {
  // Theme
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

  const subcategoryImage =
    subcategory.image ||
    "/fallback/image-not-found.png";

  // Dynamic gradient from primary → secondary
  const gradientStyle = {
    backgroundImage: `linear-gradient(to top, ${theme.colors.primary}, ${theme.colors.secondary})`,
  };

  const getSubCategoryUrl = (): string => {
    if (siteUser) {
      return `/preview/${siteUser}/collections?sub_category=${subcategory.slug}`;
    } else {
      return `/preview/collections?sub_category=${subcategory.slug}`;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const subcategoryUrl = getSubCategoryUrl();
      window.location.href = subcategoryUrl;
    }
  };

  const handleViewSubCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const subcategoryUrl = getSubCategoryUrl();
    window.location.href = subcategoryUrl;
  };

  const subcategoryUrl = getSubCategoryUrl();

  // Handle category display
  const categoryName =
    typeof subcategory.category === "object" && subcategory.category
      ? subcategory.category.name
      : "Category";

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={subcategoryUrl} className="block">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <div
        className="group relative transform overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
        style={{
          fontFamily: theme.fonts.body,
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden sm:h-56 md:h-64">
          <Image
            src={subcategoryImage}
            alt={subcategory.name}
            width={400}
            height={280}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
            style={gradientStyle}
          />

          {/* Hover Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="translate-y-4 transform text-center text-white transition-transform duration-500 group-hover:translate-y-0">
              <ChevronRight className="mx-auto mb-2 h-10 w-10" />
              <p
                className="text-base font-semibold"
                style={{ fontFamily: theme.fonts.heading }}
              >
                Explore Now
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3
              className="text-lg font-bold transition-colors duration-300 sm:text-xl"
              style={{
                fontFamily: theme.fonts.heading,
              }}
            >
              {subcategory.name}
            </h3>
            <ChevronRight
              className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
              style={{ color: theme.colors.primary }}
            />
          </div>

          {subcategory.description && (
            <p className="mb-4 line-clamp-3 text-sm leading-relaxed sm:line-clamp-2 sm:text-base">
              {subcategory.description}
            </p>
          )}

          <Button
            onClick={handleViewSubCategory}
            className="w-full transform rounded-lg px-4 py-2.5 text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg sm:py-3 sm:text-base"
            style={{
              background: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            Browse SubCategory
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};
