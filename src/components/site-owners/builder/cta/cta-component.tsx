"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  CTAData,
  isCTATemplate1,
  isCTATemplate2,
  isCTATemplate3,
  isCTATemplate4,
} from "@/types/owner-site/components/cta";
import { CTATemplate1 } from "./cta-style-1";
import { CTATemplate2 } from "./cta-style-2";
import { CTATemplate3 } from "./cta-style-3";
import { CTATemplate4 } from "./cta-style-4";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";

interface CTAComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "cta";
  data: CTAData;
  type?: "cta";
  order: number;
  page?: number;
}

interface CTAComponentProps {
  component: CTAComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onUpdate?: (componentId: string, updatedData: CTAComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const CTAComponent: React.FC<CTAComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteCTAMutation = useDeleteComponentMutation(pageSlug, "cta");
  const updateCTAMutation = useUpdateComponentMutation(pageSlug, "cta");

  const handleUpdate = (updatedData: Partial<CTAData>) => {
    const componentId = component.component_id || component.id.toString();

    updateCTAMutation.mutate({
      componentId,
      data: updatedData,
    });
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    deleteCTAMutation.mutate(componentId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const renderCTATemplate = () => {
    if (!component.data) {
      return (
        <div className="flex min-h-[200px] items-center justify-center border border-red-200 bg-red-50 px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Error: Missing CTA Data
            </h2>
            <p className="mt-2 text-red-500">Component ID: {component.id}</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    // Type-safe template rendering using type guards
    if (isCTATemplate1(component.data)) {
      return <CTATemplate1 ctaData={component.data} {...commonProps} />;
    }

    if (isCTATemplate2(component.data)) {
      return <CTATemplate2 ctaData={component.data} {...commonProps} />;
    }

    if (isCTATemplate3(component.data)) {
      return <CTATemplate3 ctaData={component.data} {...commonProps} />;
    }

    if (isCTATemplate4(component.data)) {
      return <CTATemplate4 ctaData={component.data} {...commonProps} />;
    }

    // Fallback for unknown templates
    return (
      <div className="flex min-h-[200px] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-700">
            Unknown CTA Template
          </h2>
          <p className="mt-2 text-yellow-600">
            Please select a valid template in settings.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="group relative">
      {isEditable && (
        <>
          <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
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
              disabled={deleteCTAMutation.isPending}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteCTAMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete CTA Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this CTA section? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteCTAMutation.isPending}
                >
                  {deleteCTAMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderCTATemplate()}
    </div>
  );
};
