"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Category } from "@/types/owner-site/admin/product";

interface CategoryCard6Props {
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

export const CategoryCard6: React.FC<CategoryCard6Props> = ({
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
      className="group relative h-[400px] overflow-hidden rounded-2xl md:h-[450px]"
      onClick={e => {
        if (isEditable) {
          e.preventDefault();
        } else {
          onCategoryClick?.(category.id);
        }
      }}
    >
      <Image
        width={800}
        height={600}
        src={category.image || "/fallback/image-not-found.png"}
        alt={category.name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-10"
        style={{
          background: `linear-gradient(to top, ${theme.colors.primary || "#000"}E6 0%, ${theme.colors.primary || "#000"}33 40%, transparent 100%)`,
        }}
      >
        <h3 className="mb-2 text-2xl font-bold text-white">{category.name}</h3>
        <p className="flex translate-y-4 transform items-center gap-1 text-sm font-medium text-white/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Explore Collection <ChevronRight className="h-4 w-4" />
        </p>
      </div>
    </Link>
  );
};
