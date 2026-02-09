import React, { useState, useCallback, useRef } from "react";
import {
  CategoryComponentData,
  FeaturedContent,
} from "@/types/owner-site/components/category";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { CategoryCard1 } from "./category-card-1";
import { CategoryCard2 } from "./category-card-2";
import { CategoryCard3 } from "./category-card-3";
import { CategoryCard5 } from "./category-card-5";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, FolderOpen, RefreshCw } from "lucide-react";
import { Category } from "@/types/owner-site/admin/product";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import Pagination from "@/components/ui/site-owners/pagination";
import Link from "next/link";
interface CategoryComponentProps {
  component: CategoryComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: CategoryComponentData) => void;
  onCategoryClick?: (categoryId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}
const useDebouncedCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
export const CategoryComponent: React.FC<CategoryComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onCategoryClick,
  onReplace,
}) => {
  const { data: builderData, handleTextUpdate } = useBuilderLogic(
    component.data,
    updatedData => {
      if (onUpdate) {
        onUpdate(component.component_id, {
          ...component,
          data: {
            ...component.data,
            ...updatedData,
          },
        });
      }
    }
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    title = "Our Categories",
    subtitle,
    style = "category-1",
  } = builderData || {};

  // Use unified mutation hooks
  const deleteCategoryComponent = useDeleteComponentMutation(
    pageSlug || "",
    "category"
  );
  const updateCategoryComponent = useUpdateComponentMutation(
    pageSlug || "",
    "category"
  );
  const debouncedSave = useDebouncedCallback(
    (updatedData: Partial<FeaturedContent>) => {
      if (!pageSlug || !isEditable) return;

      const updatedComponentData = {
        ...component.data,
        featuredContent: {
          ...(component.data.featuredContent || {}),
          ...updatedData,
        },
      };

      updateCategoryComponent.mutate({
        componentId: component.component_id,
        data: updatedComponentData,
      });

      if (onUpdate) {
        onUpdate(component.component_id, {
          ...component,
          data: updatedComponentData,
        });
      }
    },
    1000
  );

  const handleFeaturedContentUpdate = useCallback(
    (updatedData: Partial<FeaturedContent>) => {
      debouncedSave(updatedData);
    },
    [debouncedSave]
  );
  // Get categories with pagination
  const { data, isLoading, error } = useCategories();

  // Extract categories from the API response structure
  const categories = data?.results || [];
  const pagination = data?.pagination;

  const handleCategoryClick = (category: Category) => {
    if (onCategoryClick && component.order !== undefined) {
      onCategoryClick(category.id, component.order);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deleteCategoryComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    handleTextUpdate("title")(newTitle);

    if (pageSlug) {
      updateCategoryComponent.mutate({
        componentId: component.component_id,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    handleTextUpdate("subtitle")(newSubtitle);

    if (pageSlug) {
      updateCategoryComponent.mutate({
        componentId: component.component_id,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderCategoryCard = (category: Category, index: number) => {
    const cardProps = {
      category,
      siteUser: isEditable ? undefined : siteUser,
      onClick: () => handleCategoryClick(category),
    };

    switch (style) {
      case "category-1":
        return <CategoryCard1 key={category.id} {...cardProps} />;
      case "category-2":
        return <CategoryCard2 key={category.id} {...cardProps} />;
      case "category-3":
        return <CategoryCard2 key={category.id} {...cardProps} />;
      case "category-4":
        return <CategoryCard3 key={category.id} index={index} {...cardProps} />;
      case "category-5":
        return <CategoryCard5 key={category.id} {...cardProps} />;
      default:
        return <CategoryCard1 key={category.id} {...cardProps} />;
    }
  };

  const getLayoutClasses = () => {
    switch (style) {
      case "category-2":
        return "grid grid-cols-1 lg:grid-cols-2 gap-8";
      case "category-3":
        return "flex overflow-x-auto gap-6 pb-4 snap-x";
      case "category-1":
      case "category-5":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
    }
  };

  const Content = () => {
    if (isLoading) {
      return (
        <div className={getLayoutClasses()}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-col space-y-3 ${style === "category-3" ? "w-[280px] shrink-0 sm:w-[350px]" : ""}`}
            >
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Categories</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load categories. Please check your API connection."}
          </AlertDescription>
        </Alert>
      );
    }

    if (categories.length === 0) {
      return (
        <div className="bg-muted/50 rounded-lg py-12 text-center">
          <FolderOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            No Categories Found
          </h3>
          <p className="text-muted-foreground">
            Add some categories to your inventory to display them here.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className={getLayoutClasses()}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`relative transform snap-start transition-transform duration-200 hover:scale-105 ${isEditable ? "cursor-default" : "cursor-pointer"} ${style === "category-3" ? "w-[280px] shrink-0 sm:w-[350px]" : ""}`}
            >
              {isEditable && (
                <div className="absolute inset-0 z-10 bg-transparent" />
              )}
              {renderCategoryCard(category, index)}
            </div>
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex flex-col gap-2">
              <Link href="/admin/categories/" target="_blank" rel="noopener">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                >
                  Manage Categories
                </Button>
              </Link>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onReplace?.(component.component_id)}
                className="h-8 w-fit justify-start bg-white px-3"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Replace
              </Button>

              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 w-fit justify-start px-3"
                  disabled={deleteCategoryComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteCategoryComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Category Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this category component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteCategoryComponent.isPending}
                >
                  {deleteCategoryComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <>
            <div className="mb-12 text-center">
              <EditableText
                value={title}
                onChange={handleTitleChange}
                as="h2"
                className="text-foreground mb-4 text-4xl font-bold tracking-tight"
                isEditable={isEditable}
                placeholder="Enter title..."
              />
              {(subtitle || isEditable) && (
                <EditableText
                  value={subtitle || ""}
                  onChange={handleSubtitleChange}
                  as="p"
                  className="text-muted-foreground mx-auto max-w-3xl text-xl"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                  multiline={true}
                />
              )}
            </div>
            <Content />
          </>
        </div>
      </section>
    </div>
  );
};
