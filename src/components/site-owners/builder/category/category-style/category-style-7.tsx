"use client";

import React from "react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { EditableText } from "@/components/ui/editable-text";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Category } from "@/types/owner-site/admin/product";
import { CategoryCard7 } from "../category-card/category-card-7";
import { FolderOpen } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface CategoryStyleProps {
  data: CategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CategoryComponentData["data"]>) => void;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryStyle7: React.FC<CategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onCategoryClick,
}) => {
  const { title = "Browse Categories" } = data || {};
  const { data: categoriesData, isLoading } = useCategories();
  const categories = (categoriesData?.results || []) as Category[];

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

  if (!isLoading && (!categories || categories.length === 0)) {
    return (
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <BuilderEmptyState
            icon={FolderOpen}
            title="No Categories Found"
            description="Organize your content by adding categories from the admin dashboard."
            actionLabel="Manage Categories"
            actionLink="/admin/category"
            isEditable={isEditable}
          />
        </div>
      </section>
    );
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
              <CategoryCard7
                key={cat.id}
                category={cat}
                theme={theme}
                isEditable={isEditable}
                siteUser={siteUser}
                onCategoryClick={onCategoryClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
