"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Category } from "@/types/owner-site/admin/product";

interface CategoryCard7Props {
  category: Category;
  theme: {
    colors: {
      primary: string;
    };
  };
  isEditable?: boolean;
  siteUser?: string;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryCard7: React.FC<CategoryCard7Props> = ({
  category,
  theme,
  isEditable = false,
  siteUser,
  onCategoryClick,
}) => {
  const pathname = usePathname();

  const getCategoryUrl = (category: Category): string => {
    return generateLinkHref(
      `/collections?category=${category.slug}`,
      siteUser,
      pathname
    );
  };

  return (
    <Link
      href={getCategoryUrl(category)}
      className="group flex flex-col items-center gap-4"
      onClick={e => {
        if (isEditable) {
          e.preventDefault();
        } else {
          onCategoryClick?.(category.id);
        }
      }}
    >
      <div
        className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-transparent transition-all duration-300 md:h-24 md:w-24"
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = theme.colors.primary;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <Image
          src={category.image || "/fallback/image-not-found.png"}
          alt={category.name}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-center text-sm font-bold tracking-wider uppercase transition-colors">
        {category.name}
      </span>
    </Link>
  );
};
