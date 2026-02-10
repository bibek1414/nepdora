"use client";
import React, { useState } from "react";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CategoryStyle1 } from "./category-style/category-style-1";
import { CategoryStyle2 } from "./category-style/category-style-2";
import { CategoryStyle3 } from "./category-style/category-style-3";
import { CategoryStyle4 } from "./category-style/category-style-4";
import { CategoryStyle5 } from "./category-style/category-style-5";
import { CategoryStyle6 } from "./category-style/category-style-6";

interface CategoryComponentProps {
  component: CategoryComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: CategoryComponentData) => void;
  onCategoryClick?: (categoryId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const CategoryComponent: React.FC<CategoryComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onCategoryClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteCategoryComponent = useDeleteComponentMutation(
    pageSlug || "",
    "category"
  );
  const updateCategoryComponent = useUpdateComponentMutation(
    pageSlug || "",
    "category"
  );

  const handleUpdate = (
    updatedData: Partial<CategoryComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateCategoryComponent.mutate({
      componentId,
      data: newData,
    });

    if (onUpdate) {
      onUpdate(componentId, {
        ...component,
        data: newData,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) return;
    deleteCategoryComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderCategoryStyle = () => {
    const style = component.data?.style || "category-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onCategoryClick: (categoryId: number) => {
        if (onCategoryClick && component.order !== undefined) {
          onCategoryClick(categoryId, component.order);
        }
      },
    };

    switch (style) {
      case "category-2":
        return <CategoryStyle2 {...commonProps} />;
      case "category-3":
        return <CategoryStyle3 {...commonProps} />;
      case "category-4":
        return <CategoryStyle4 {...commonProps} />;
      case "category-5":
        return <CategoryStyle5 {...commonProps} />;
      case "category-6":
        return <CategoryStyle6 {...commonProps} />;
      case "category-1":
      default:
        return <CategoryStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              size="sm"
              className="h-8 w-fit justify-start px-3"
              disabled={deleteCategoryComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteCategoryComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this category component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteCategoryComponent.isPending}
                >
                  {deleteCategoryComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderCategoryStyle()}
    </div>
  );
};
