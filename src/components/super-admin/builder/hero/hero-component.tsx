"use client";
import React, { useState, useEffect } from "react";
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
import { HeroTemplate1 } from "@/components/site-owners/builder/hero/hero-style-1";
import { HeroTemplate2 } from "@/components/site-owners/builder/hero/hero-style-2";
import { HeroTemplate3 } from "@/components/site-owners/builder/hero/hero-style-3";
import { HeroTemplate4 } from "@/components/site-owners/builder/hero/hero-style-4";
import { HeroTemplate5 } from "@/components/site-owners/builder/hero/hero-style-5";
import { HeroTemplate6 } from "@/components/site-owners/builder/hero/hero-style-6";
import { HeroTemplate7 } from "@/components/site-owners/builder/hero/hero-style-7";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/super-admin/components/use-unified";
import { HeroTemplate8 } from "@/components/site-owners/builder/hero/hero-style-8";
import { HeroTemplate9 } from "@/components/site-owners/builder/hero/hero-style-9";

interface HeroComponentProps {
  component: HeroComponentData;
  isEditable?: boolean;
  pageSlug: string;
  templateSlug: string;
}

export const HeroComponent: React.FC<HeroComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  templateSlug,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.group("🔍 HeroComponent Debug Info");
    console.log("pageSlug:", pageSlug);
    console.log("templateSlug:", templateSlug);
    console.log("component.id:", component.id);
    console.log("component.component_id:", component.component_id);
    console.log("Expected API paths:");
    console.log(
      `  GET: /api/template-pages/${templateSlug}/${pageSlug}/components/`
    );
    console.log(
      `  PATCH/DELETE: /api/template-pages/${templateSlug}/${pageSlug}/components/${component.component_id || component.id}/`
    );
    console.groupEnd();
  }, [pageSlug, templateSlug, component]);

  const deleteHeroMutation = useDeleteComponentMutation(
    pageSlug,
    "hero",
    templateSlug
  );
  const updateHeroMutation = useUpdateComponentMutation(
    pageSlug,
    "hero",
    templateSlug
  );

  const handleUpdate = (updatedData: Partial<HeroData>) => {
    const componentId = component.component_id || component.id.toString();

    console.log("🔄 Updating hero component:", {
      componentId,
      pageSlug,
      templateSlug,
      expectedEndpoint: `/api/template-pages/${templateSlug}/${pageSlug}/components/${componentId}/`,
    });

    updateHeroMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          console.error("❌ Update failed:", error);
          toast.error("Failed to update hero section", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
        onSuccess: () => {
          console.log("✅ Update successful");
        },
      }
    );
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    console.log("🗑️ Deleting hero component:", {
      componentId,
      pageSlug,
      templateSlug,
      expectedEndpoint: `/api/template-pages/${templateSlug}/${pageSlug}/components/${componentId}/`,
    });

    // Show loading toast
    const loadingToast = toast.loading("Deleting hero section...");

    deleteHeroMutation.mutate(componentId, {
      onSuccess: () => {
        console.log("✅ Delete successful");
        toast.dismiss(loadingToast);
        toast.success("Hero section deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        console.error("❌ Delete failed:", error);
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
          <div className="bg-background/80 absolute top-4 right-4 z-30 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteHeroMutation.isPending}
              className=""
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
