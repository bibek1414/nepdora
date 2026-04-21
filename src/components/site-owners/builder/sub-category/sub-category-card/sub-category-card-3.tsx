import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SubCategory } from "@/types/owner-site/admin/product";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

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
  const pathname = usePathname();
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

  const subcategoryImage = subcategory.image || "/fallback/image-not-found.png";

  const getSubCategoryUrl = (sub: SubCategory): string => {
    return generateLinkHref(
      `/collections?sub_category=${sub.slug}`,
      siteUser,
      pathname
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = getSubCategoryUrl(subcategory);
    }
  };

  const subcategoryUrl = getSubCategoryUrl(subcategory);

  const handleViewSubCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = subcategoryUrl;
  };

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
        className="relative transform overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
        style={{
          fontFamily: theme.fonts.body,
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden sm:h-56 md:h-64">
          <Image unoptimized
            src={subcategoryImage}
            alt={subcategory.name}
            width={400}
            height={280}
            className="h-full w-full object-cover transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
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
              className="h-5 w-5 flex-shrink-0 transition-all duration-300"
              style={{ color: theme.colors.primary }}
            />
          </div>

          {subcategory.description && (
            <p className="mb-4 line-clamp-3 text-sm leading-relaxed sm:line-clamp-2 sm:text-base">
              {subcategory.description}
            </p>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};
