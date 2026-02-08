"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, RefreshCw } from "lucide-react";
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
import { toast } from "sonner";
import {
  GalleryData,
  GalleryComponentData,
} from "@/types/owner-site/components/gallery";
import { GalleryTemplate1 } from "./gallery-template-1";
import { GalleryTemplate2 } from "./gallery-template-2";
import { GalleryTemplate3 } from "./gallery-template-3";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { GalleryTemplate4 } from "./gallery-template-4";
import { GalleryTemplate5 } from "./gallery-template-5";
import { GalleryTemplate6 } from "./gallery-template-6";
import { GalleryTemplate7 } from "./gallery-template-7";

interface GalleryComponentProps {
  component: GalleryComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onUpdate?: (componentId: string, updatedData: GalleryComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const GalleryComponent: React.FC<GalleryComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteGalleryMutation = useDeleteComponentMutation(pageSlug, "gallery");
  const updateGalleryMutation = useUpdateComponentMutation(pageSlug, "gallery");

  const handleUpdate = (updatedData: Partial<GalleryData>) => {
    const componentId = component.component_id || component.id.toString();

    if (onUpdate) {
      const updatedComponent: GalleryComponentData = {
        ...component,
        data: {
          ...component.data,
          ...updatedData,
        },
      };
      onUpdate(componentId, updatedComponent);
    }

    updateGalleryMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          toast.error("Failed to update gallery", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();
    const loadingToast = toast.loading("Deleting gallery...");

    deleteGalleryMutation.mutate(componentId, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Gallery deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete gallery", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      },
    });
  };

  const renderGalleryTemplate = () => {
    if (!component.data) {
      return (
        <div className="flex min-h-[200px] items-center justify-center border border-red-200 bg-red-50 px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Error: Missing Gallery Data
            </h2>
            <p className="mt-2 text-red-500">Component ID: {component.id}</p>
          </div>
        </div>
      );
    }

    const props = {
      galleryData: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    const template = component.data.template || "gallery-1";

    switch (template) {
      case "gallery-1":
        return <GalleryTemplate1 {...props} />;
      case "gallery-2":
        return <GalleryTemplate2 {...props} />;
      case "gallery-3":
        return <GalleryTemplate3 {...props} />;
      case "gallery-4":
        return <GalleryTemplate4 {...props} />;
      case "gallery-5":
        return <GalleryTemplate5 {...props} />;
      case "gallery-6":
        return <GalleryTemplate6 {...props} />;
      case "gallery-7":
        return <GalleryTemplate7 {...props} />;
      default:
        return (
          <div className="flex min-h-[200px] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-yellow-700">
                Unknown Gallery Template: {template}
              </h2>
              <p className="mt-2 text-yellow-600">
                Please select a valid template in settings.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <>
          <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Link href="/admin/gallery/" target="_blank" rel="noopener">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                Manage Gallery
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onReplace?.(component.component_id || component.id.toString())
              }
              className="h-8 w-fit justify-start bg-white px-3"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Replace
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteGalleryMutation.isPending}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteGalleryMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Gallery</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this gallery? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteGalleryMutation.isPending}
                >
                  {deleteGalleryMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderGalleryTemplate()}
    </div>
  );
};
