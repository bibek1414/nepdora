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
  HeroData,
  HeroComponentData,
} from "@/types/owner-site/components/hero";
import { HeroTemplate1 } from "./hero-style-1";
import { HeroTemplate2 } from "./hero-style-2";
import { HeroTemplate3 } from "./hero-style-3";
import { HeroTemplate4 } from "./hero-style-4";
import { HeroTemplate5 } from "./hero-style-5";
import { HeroTemplate6 } from "./hero-style-6";
import { HeroTemplate7 } from "./hero-style-7";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { HeroTemplate8 } from "./hero-style-8";
import { HeroTemplate9 } from "./hero-style-9";
import { HeroTemplate10 } from "./hero-style-10";
import { HeroTemplate11 } from "./hero-style-11";
import { HeroTemplate12 } from "./hero-style-12";
import { HeroTemplate13 } from "./hero-style-13";

interface HeroComponentProps {
  component: HeroComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
}

export const HeroComponent: React.FC<HeroComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteHeroMutation = useDeleteComponentMutation(pageSlug, "hero");
  const updateHeroMutation = useUpdateComponentMutation(pageSlug, "hero");

  const handleUpdate = (updatedData: Partial<HeroData>) => {
    const componentId = component.component_id || component.id.toString();

    updateHeroMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          toast.error("Failed to update hero section", {
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
    const loadingToast = toast.loading("Deleting hero section...");

    deleteHeroMutation.mutate(componentId, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Hero section deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete hero section", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      },
    });
  };

  const renderHeroTemplate = () => {
    // Check if component data exists
    if (!component.data) {
      console.error("Hero component data is missing:", component);
      return (
        <div className="flex min-h-[60vh] items-center justify-center border border-red-200 bg-red-50 px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Error: Missing Hero Data
            </h2>
            <p className="mt-2 text-red-500">Component ID: {component.id}</p>
          </div>
        </div>
      );
    }

    const props = {
      heroData: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    // Get template from data, default to hero-1 if not specified
    const template = component.data.template || "hero-1";

    console.log("Rendering template:", template);

    switch (template) {
      case "hero-1":
        return <HeroTemplate1 {...props} />;
      case "hero-2":
        return <HeroTemplate2 {...props} />;
      case "hero-3":
        return <HeroTemplate3 {...props} />;
      case "hero-4":
        return <HeroTemplate4 {...props} />;
      case "hero-5":
        return <HeroTemplate5 {...props} />;
      case "hero-6":
        return <HeroTemplate6 {...props} />;
      case "hero-7":
        return <HeroTemplate7 {...props} />;
      case "hero-8":
        return <HeroTemplate8 {...props} />;
      case "hero-9":
        return <HeroTemplate9 {...props} />;
      case "hero-10":
        return <HeroTemplate10 {...props} />;
      case "hero-11":
        return <HeroTemplate11 {...props} />;
      case "hero-12":
        return <HeroTemplate12 {...props} />;
      case "hero-13":
        return <HeroTemplate13 {...props} />;
      default:
        return (
          <div className="flex min-h-[60vh] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-700">
                Unknown Hero Template: {template}
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
          <div className="bg-background/80 absolute -right-5 z-30 flex translate-x-full gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteHeroMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Hero Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this hero section? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteHeroMutation.isPending}
                >
                  {deleteHeroMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Hero Template Render */}
      {renderHeroTemplate()}
    </div>
  );
};
