"use client";
import React, { useState } from "react";
import { VideosComponentData } from "@/types/owner-site/components/videos";
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
import { VideosStyle1 } from "./videos-style/videos-style-1";

interface VideosComponentProps {
  component: VideosComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: VideosComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const VideosComponent: React.FC<VideosComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteVideosComponent = useDeleteComponentMutation(
    pageSlug || "",
    "videos"
  );
  const updateVideosComponent = useUpdateComponentMutation(
    pageSlug || "",
    "videos"
  );

  const handleUpdate = (updatedData: Partial<VideosComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateVideosComponent.mutate({
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
    deleteVideosComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderVideosStyle = () => {
    const style = component.data?.style || "videos-1";
    const commonProps = {
      data: component.data,
      isEditable,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "videos-1":
      default:
        return <VideosStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/videos/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Videos
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
              disabled={deleteVideosComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteVideosComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Videos Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this videos component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteVideosComponent.isPending}
                >
                  {deleteVideosComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderVideosStyle()}
    </div>
  );
};
