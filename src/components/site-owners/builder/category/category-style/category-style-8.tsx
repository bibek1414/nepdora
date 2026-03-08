"use client";

import React from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/owner-site/admin/use-category';
import Image from 'next/image';
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
      <section className="mb-16 py-16 lg:py-24 bg-white" style={{ backgroundColor: theme.colors.background }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
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
    <section className="mb-16 py-16 lg:py-24 bg-white" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-black mb-8" style={{ color: theme.colors.primary }}>
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="span"
            isEditable={isEditable}
          />
        </h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {categories.map((cat) => {
            return (
              <Link 
                href={getCategoryUrl(cat)} 
                key={cat.id} 
                className="flex flex-col items-center gap-4 group"
                onClick={e => {
                  if (isEditable) {
                    e.preventDefault();
                  } else {
                    onCategoryClick?.(cat.id);
                  }
                }}
              >
                <div 
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent transition-all duration-300"
                  style={{ '--hover-color': theme.colors.primary } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                   <Image 
                     src={cat.image || '/fallback/image-not-found.png'} 
                     alt={cat.name} 
                     fill 
                     className="object-cover" 
                   />
                </div>
                <span 
                  className="text-sm font-bold transition-colors uppercase tracking-wider text-center" 
                  style={{ color: theme.colors.text }}
                >
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
