"use client";
import React from "react";
import { CategoryCard4 } from "../category-card/category-card-4";
import { CategoryComponentData } from "@/types/owner-site/components/category";

interface CategoryStyleProps {
  data: CategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CategoryComponentData["data"]>) => void;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryStyle4: React.FC<CategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const handleFeaturedContentUpdate = (
    updatedFeaturedContent: Partial<CategoryComponentData["data"]["featuredContent"]>
  ) => {
    onUpdate?.({
      featuredContent: {
        ...data.featuredContent,
        ...updatedFeaturedContent,
      },
    });
  };

  return (
    <section className="bg-background">
      <CategoryCard4
        isEditable={isEditable}
        siteUser={siteUser}
        initialFeaturedContent={data.featuredContent}
        onFeaturedContentUpdate={handleFeaturedContentUpdate}
      />
    </section>
  );
};
