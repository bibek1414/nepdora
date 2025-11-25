import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/owner-site/admin/product";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Button } from "@/components/ui/button";

interface CategoryCard3Props {
  category: Category;
  siteUser?: string;
  onClick?: () => void;
  index?: number;
}

export const CategoryCard3: React.FC<CategoryCard3Props> = ({
  category,
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

  // Use actual category data with fallback
  const categoryImage =
    category.image ||
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop";

  // Dynamic gradient from primary → secondary
  const gradientStyle = {
    backgroundImage: `linear-gradient(to top, ${theme.colors.primary}, ${theme.colors.secondary})`,
  };

  const getCategoryUrl = (): string => {
    if (siteUser) {
      return `/collections?category=${category.slug}`;
    } else {
      return `/publish/collections?category=${category.slug}`;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = getCategoryUrl();
    }
  };

  const handleViewCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = getCategoryUrl();
  };

  const categoryUrl = getCategoryUrl();

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={categoryUrl} className="block">
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
        <div className="relative h-64 overflow-hidden">
          <Image
            src={categoryImage}
            alt={category.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
            style={gradientStyle}
          />

          {/* Hover Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="translate-y-4 transform text-center text-white transition-transform duration-500 group-hover:translate-y-0">
              <ArrowRight className="mx-auto mb-2 h-12 w-12" />
              <p
                className="text-lg font-semibold"
                style={{ fontFamily: theme.fonts.heading }}
              >
                Explore Now
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3
              className="text-2xl font-bold transition-colors duration-300"
              style={{
                fontFamily: theme.fonts.heading,
              }}
            >
              {category.name}
            </h3>
            <ArrowRight
              className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1"
              style={{ color: theme.colors.primary }}
            />
          </div>

          {category.description && (
            <p className="mb-4 text-sm">{category.description}</p>
          )}

          <Button
            onClick={handleViewCategory}
            className="w-full transform rounded-lg px-4 py-3 font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            Browse Collection
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};
