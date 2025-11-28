import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Tag } from "lucide-react";
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
  const subcategoryImage =
    subcategory.image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";

  const getSubCategoryUrl = (): string => {
    if (siteUser) {
      return `/collections?sub_category=${subcategory.slug}`;
    } else {
      return `/publish/collections?sub_category=${subcategory.slug}`;
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
      <div className="group relative h-80 cursor-pointer overflow-hidden rounded-xl shadow-lg">
        <Image
          src={subcategoryImage}
          alt={subcategory.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold md:text-3xl">{subcategory.name}</h2>
          {subcategory.description && (
            <p className="mt-1 line-clamp-2 text-sm opacity-90">
              {subcategory.description}
            </p>
          )}
          <a className="mt-2 inline-flex items-center rounded-full bg-black/70 px-4 py-2 text-sm font-semibold transition-colors hover:bg-black md:text-base">
            EXPLORE <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </CardWrapper>
  );
};
