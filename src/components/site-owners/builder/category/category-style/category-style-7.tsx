import React from "react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight, FolderOpen } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";
import Link from "next/link";

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
  const { title = "Shop by Category" } = data || {};
  const { data: categoriesData, isLoading, error } = useCategories();
  const categories = categoriesData?.results || [];

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
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative h-[400px] overflow-hidden rounded-2xl md:h-[450px]"
                onClick={e => {
                  if (isEditable) {
                    e.preventDefault();
                  } else {
                    onCategoryClick?.(cat.id);
                  }
                }}
              >
                <Image
                  width={800}
                  height={600}
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600"
                  }
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-8 md:p-10"
                  style={{
                    background: `linear-gradient(to top, ${theme.colors.primary || "#000"}E6 0%, ${theme.colors.primary || "#000"}33 40%, transparent 100%)`,
                  }}
                >
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {cat.name}
                  </h3>
                  <p className="flex translate-y-4 transform items-center gap-1 text-sm font-medium text-white/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore Collection <ChevronRight className="h-4 w-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 py-16 text-center shadow-inner">
            <FolderOpen className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              No Categories Found
            </h3>
            <p className="text-gray-500">
              Add some categories to display them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
