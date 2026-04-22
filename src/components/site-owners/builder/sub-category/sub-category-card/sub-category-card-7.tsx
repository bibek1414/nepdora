"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { SubCategory } from "@/types/owner-site/admin/product";

interface SubCategoryCard7Props {
  subcategory: SubCategory;
  theme: {
    colors: {
      primary: string;
    };
  };
  isEditable?: boolean;
  siteUser?: string;
  onSubCategoryClick?: (subcategoryId: number) => void;
}

export const SubCategoryCard7: React.FC<SubCategoryCard7Props> = ({
  subcategory,
  theme,
  isEditable = false,
  siteUser,
  onSubCategoryClick,
}) => {
  const pathname = usePathname();

  const getSubCategoryUrl = (sub: SubCategory): string => {
    return generateLinkHref(
      `/collections?sub_category=${sub.slug}`,
      siteUser,
      pathname
    );
  };

  return (
    <Link
      href={getSubCategoryUrl(subcategory)}
      className="group flex flex-col items-center gap-4"
      onClick={e => {
        if (isEditable) {
          e.preventDefault();
        } else {
          onSubCategoryClick?.(subcategory.id);
        }
      }}
    >
      <div
        className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-transparent transition-all duration-300 md:h-24 md:w-24"
        style={{
          borderColor: "transparent",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = theme.colors.primary;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <Image
          unoptimized
          src={subcategory.image || "/fallback/image-not-found.png"}
          alt={subcategory.name}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-center text-sm font-bold tracking-wider uppercase transition-colors">
        {subcategory.name}
      </span>
    </Link>
  );
};
