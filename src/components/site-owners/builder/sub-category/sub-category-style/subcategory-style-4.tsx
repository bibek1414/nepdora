"use client";

import React from "react";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { EditableText } from "@/components/ui/editable-text";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { SubCategory } from "@/types/owner-site/admin/product";
import { SubCategoryCard7 } from "../sub-category-card/sub-category-card-7";

interface SubCategoryStyleProps {
  data: SubCategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<SubCategoryComponentData["data"]>) => void;
  onSubCategoryClick?: (subcategoryId: number) => void;
}

export const SubCategoryStyle4: React.FC<SubCategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onSubCategoryClick,
}) => {
  const { title = "Browse Subcategories" } = data || {};
  const { data: subcategoriesData, isLoading } = useSubCategories();
  const subcategories = (subcategoriesData?.results || []) as SubCategory[];

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

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 bg-white py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-2xl font-black">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h1"
            isEditable={isEditable}
          />
        </h2>

        <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
          {subcategories.map(sub => {
            return (
              <SubCategoryCard7
                key={sub.id}
                subcategory={sub}
                theme={theme}
                isEditable={isEditable}
                siteUser={siteUser}
                onSubCategoryClick={onSubCategoryClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
