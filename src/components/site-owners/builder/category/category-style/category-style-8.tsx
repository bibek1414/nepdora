"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import Image from "next/image";
import { EditableText } from "@/components/ui/editable-text";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Category } from "@/types/owner-site/admin/product";

interface CategoryStyleProps {
  data: CategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CategoryComponentData["data"]>) => void;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryStyle8: React.FC<CategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onCategoryClick,
}) => {
  const { title = "Browse Categories" } = data || {};
  const { data: categoriesData, isLoading } = useCategories();
  const categories = (categoriesData?.results || []) as Category[];
  const pathname = usePathname();

  const getCategoryUrl = (category: Category): string => {
    return generateLinkHref(
      `/collections?category=${category.slug}`,
      siteUser,
      pathname
    );
  };

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#000000",
      primary: "#111827",
      secondary: "#374151",
      background: "#FFFFFF",
    },
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  if (isLoading) {
    return (
      <section
        className="mb-16 bg-white py-16 lg:py-24"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid animate-pulse grid-cols-3 gap-6 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-200 md:h-24 md:w-24" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 bg-white py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-2xl font-black">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="span"
            isEditable={isEditable}
          />
        </h2>

        <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
          {categories.map(cat => {
            return (
              <Link
                href={getCategoryUrl(cat)}
                key={cat.id}
                className="group flex flex-col items-center gap-4"
                onClick={e => {
                  if (isEditable) {
                    e.preventDefault();
                  } else {
                    onCategoryClick?.(cat.id);
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
                    src={cat.image || "/fallback/image-not-found.png"}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-center text-sm font-bold tracking-wider uppercase transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
