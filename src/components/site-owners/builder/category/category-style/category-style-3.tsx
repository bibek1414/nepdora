"use client";
import React from "react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { CategoryCard2 } from "../category-card/category-card-2";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FolderOpen } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { CategoryComponentData } from "@/types/owner-site/components/category";

interface CategoryStyleProps {
  data: CategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CategoryComponentData["data"]>) => void;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryStyle3: React.FC<CategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onCategoryClick,
}) => {
  const { title = "Our Categories", subtitle } = data || {};
  const { data: categoriesData, isLoading, error } = useCategories();
  const categories = categoriesData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-xl"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[280px] shrink-0 space-y-3 sm:w-[350px]"
              >
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Categories</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load categories."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <div className="flex snap-x gap-6 overflow-x-auto pb-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="relative w-[280px] shrink-0 transform cursor-pointer snap-start transition-transform duration-200 hover:scale-105 sm:w-[350px]"
                onClick={() => !isEditable && onCategoryClick?.(category.id)}
              >
                {isEditable && <div className="absolute inset-0 z-10" />}
                <CategoryCard2 category={category} siteUser={siteUser} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && categories.length === 0 && (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <FolderOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No Categories Found
            </h3>
            <p className="text-muted-foreground">
              Add some categories to display them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
