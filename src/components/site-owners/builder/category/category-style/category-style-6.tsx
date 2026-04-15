import React from "react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FolderOpen } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { Category } from "@/types/owner-site/admin/product";
import { CategoryCard6 } from "../category-card/category-card-6";

interface CategoryStyleProps {
  data: CategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CategoryComponentData["data"]>) => void;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryStyle6: React.FC<CategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onCategoryClick,
}) => {
  const { title = "Shop by Category" } = data || {};
  const { data: categoriesData, isLoading, error } = useCategories();
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

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2
          className="mb-16 text-center text-3xl font-bold md:text-4xl"
          style={{ color: theme.colors.primary }}
        >
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="span"
            isEditable={isEditable}
          />
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[400px] w-full rounded-2xl md:h-[450px]"
              />
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.slice(0, 3).map(cat => (
              <CategoryCard6
                key={cat.slug}
                category={cat}
                theme={theme}
                isEditable={isEditable}
                siteUser={siteUser}
                onCategoryClick={onCategoryClick}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && categories.length === 0 && (
          <BuilderEmptyState
            icon={FolderOpen}
            title="No Categories Found"
            description="Organize your content by adding categories from the admin dashboard."
            actionLabel="Manage Categories"
            actionLink="/admin/categories"
            isEditable={isEditable}
          />
        )}
      </div>
    </section>
  );
};
