import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Tag } from "lucide-react";
import { SubCategory } from "@/types/owner-site/admin/product";

interface SubCategoryCard2Props {
  subcategory: SubCategory;
  siteUser?: string;
  onClick?: () => void;
}

export const SubCategoryCard2: React.FC<SubCategoryCard2Props> = ({
  subcategory,
  siteUser,
  onClick,
}) => {
  const subcategoryImage = subcategory.image || "/fallback/image-not-found.png";

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

  const subcategoryUrl = getSubCategoryUrl();

  // Handle category display
  const categoryName =
    typeof subcategory.category === "object" && subcategory.category
      ? subcategory.category.name
      : "Category";

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={subcategoryUrl}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <div className="group relative h-72 cursor-pointer overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl sm:h-80 md:h-96">
        <Image
          src={subcategoryImage}
          alt={subcategory.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute right-4 bottom-4 left-4 text-white sm:right-auto">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {subcategory.name}
          </h2>
          {subcategory.description && (
            <p className="mt-2 line-clamp-3 text-sm opacity-90 sm:line-clamp-2 sm:text-base">
              {subcategory.description}
            </p>
          )}
          <div className="mt-3 inline-flex items-center rounded-full bg-black/70 px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors hover:bg-black sm:text-sm md:text-base">
            Explore
            <ChevronRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
