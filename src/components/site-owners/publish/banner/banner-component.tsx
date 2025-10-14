"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  BannerData,
  BannerComponentData,
} from "@/types/owner-site/components/banner";
import { BannerTemplate1 } from "./banner-template-1";
import { BannerTemplate2 } from "./banner-template-2";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";

interface BannerComponentProps {
  component: BannerComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onUpdate?: (componentId: string, updatedData: BannerComponentData) => void;
}

export const BannerComponent: React.FC<BannerComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onUpdate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteBannerMutation = useDeleteComponentMutation(pageSlug, "banner");
  const updateBannerMutation = useUpdateComponentMutation(pageSlug, "banner");

  const handleUpdate = (updatedData: Partial<BannerData>) => {
    const componentId = component.component_id || component.id.toString();

    // If parent onUpdate is provided, use it (for optimistic updates or custom handling)
    if (onUpdate) {
      const updatedComponent: BannerComponentData = {
        ...component,
        data: {
          ...component.data,
          ...updatedData,
        },
      };
      onUpdate(componentId, updatedComponent);
    }

    // Also trigger the mutation for server sync
    updateBannerMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          toast.error("Failed to update banner", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    // Show loading toast
    const loadingToast = toast.loading("Deleting banner...");

    deleteBannerMutation.mutate(componentId, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Banner deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete banner", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      },
    });
  };

  const renderBannerTemplate = () => {
    // Check if component data exists
    if (!component.data) {
      console.error("Banner component data is missing:", component);
      return (
        <div className="flex min-h-[200px] items-center justify-center border border-red-200 bg-red-50 px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Error: Missing Banner Data
            </h2>
            <p className="mt-2 text-red-500">Component ID: {component.id}</p>
          </div>
        </div>
      );
    }

    const props = {
      bannerData: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    // Get template from data, default to banner-1 if not specified
    const template = component.data.template || "banner-1";

    console.log("Rendering banner template:", template);

    switch (template) {
      case "banner-1":
        return <BannerTemplate1 {...props} />;
      case "banner-2":
        return <BannerTemplate2 {...props} />;

      default:
        return (
          <div className="flex min-h-[200px] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-yellow-700">
                Unknown Banner Template: {template}
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
      {/* Edit Controls - Only show when editable */}
      {isEditable && (
        <>
          <div className="bg-background/80 absolute top-4 right-4 z-30 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteBannerMutation.isPending}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this banner? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteBannerMutation.isPending}
                >
                  {deleteBannerMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Banner Template Render */}
      {renderBannerTemplate()}
    </div>
  );
};
