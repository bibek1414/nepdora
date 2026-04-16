"use client";
import React from "react";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { SubCategoryCard3 } from "../sub-category-card/sub-category-card-3";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FolderOpen } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface SubCategoryStyleProps {
  data: SubCategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<SubCategoryComponentData["data"]>) => void;
  onSubCategoryClick?: (subcategoryId: number) => void;
}

export const SubCategoryStyle2: React.FC<SubCategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onSubCategoryClick,
}) => {
  const { title = "Our SubCategories", subtitle } = data || {};
  const { data: subcategoriesData, isLoading, error , refetch } = useSubCategories();
  const subcategories = subcategoriesData?.results || [];

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
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
            <AlertTitle>Error Loading SubCategories</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load subcategories."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && subcategories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {subcategories.map(subcategory => (
              <div
                key={subcategory.id}
                className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() =>
                  !isEditable && onSubCategoryClick?.(subcategory.id)
                }
              >
                {isEditable && <div className="absolute inset-0 z-10" />}
                <SubCategoryCard3
                  subcategory={subcategory}
                  siteUser={siteUser}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={FolderOpen}
            title="No SubCategories Found"
            description="Organize your categories further by adding subcategories in the admin dashboard."
            actionLabel="Add New SubCategories"
            actionLink="/admin/sub-category"
            isEditable={isEditable}
          isEmpty={subcategories.length === 0}
          onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
