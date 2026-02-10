"use client";
import React, { useState } from "react";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
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
import { SubCategoryStyle1 } from "./sub-category-style/subcategory-style-1";
import { SubCategoryStyle2 } from "./sub-category-style/subcategory-style-2";
import { SubCategoryStyle3 } from "./sub-category-style/subcategory-style-3";

interface SubCategoryComponentProps {
  component: SubCategoryComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: SubCategoryComponentData) => void;
  onSubCategoryClick?: (subcategoryId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const SubCategoryComponent: React.FC<SubCategoryComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onSubCategoryClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteSubCategoryComponent = useDeleteComponentMutation(
    pageSlug || "",
    "subcategory"
  );
  const updateSubCategoryComponent = useUpdateComponentMutation(
    pageSlug || "",
    "subcategory"
  );

  const handleUpdate = (
    updatedData: Partial<SubCategoryComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateSubCategoryComponent.mutate({
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
    deleteSubCategoryComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderSubCategoryStyle = () => {
    const style = component.data?.style || "grid-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onSubCategoryClick: (subcategoryId: number) => {
        if (onSubCategoryClick && component.order !== undefined) {
          onSubCategoryClick(subcategoryId, component.order);
        }
      },
    };

    switch (style) {
      case "subcategory-2":
        return <SubCategoryStyle2 {...commonProps} />;
      case "subcategory-3":
        return <SubCategoryStyle3 {...commonProps} />;
      case "subcategory-1":
      default:
        return <SubCategoryStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/subcategories/" target="_blank" rel="noopener">
            <Button size="sm" variant="outline" className="text-sm">
              Manage Subcategories
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
              className="h-8 px-3 text-sm"
              disabled={deleteSubCategoryComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteSubCategoryComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete SubCategory Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this subcategory component?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteSubCategoryComponent.isPending}
                >
                  {deleteSubCategoryComponent.isPending
                    ? "Deleting..."
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderSubCategoryStyle()}
    </div>
  );
};
