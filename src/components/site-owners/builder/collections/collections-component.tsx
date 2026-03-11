"use client";
import React, { useState } from "react";
import { CollectionsData } from "@/types/owner-site/components/collections";
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
import { Trash2, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CollectionsStyle1 } from "./collections-style/collections-style-1";
import { CollectionsStyle2 } from "./collections-style/collections-style-2";
import { CollectionsStyle3 } from "./collections-style/collections-style-3";
import { ComponentResponse } from "@/types/owner-site/components/components";

interface CollectionsComponentProps {
  component: ComponentResponse<"collections">;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ComponentResponse<"collections">) => void;
  onReplace?: (componentId: string) => void;
}

export const CollectionsComponent: React.FC<CollectionsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteComponent = useDeleteComponentMutation(
    pageSlug || "",
    "collections"
  );
  const updateComponent = useUpdateComponentMutation(
    pageSlug || "",
    "collections"
  );

  const handleUpdate = (
    updatedData: Partial<CollectionsData>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateComponent.mutate({
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
    deleteComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderStyle = () => {
    const style = component.data?.style || "collections-style-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "collections-style-2":
        return <CollectionsStyle2 {...commonProps} />;
      case "collections-style-3":
        return <CollectionsStyle3 {...commonProps} />;
      case "collections-style-1":
      default:
        return <CollectionsStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={`/admin/collections/${component.data.collectionSlug}/data`} target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start bg-white"
            >
              <Settings className="mr-1 h-4 w-4" />
              Manage Data
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
              disabled={deleteComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Collections Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this collections component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteComponent.isPending}
                >
                  {deleteComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderStyle()}
    </div>
  );
};
