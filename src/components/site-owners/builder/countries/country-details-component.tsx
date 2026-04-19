"use client";
import React, { useState } from "react";
import { CountryDetailsData } from "@/types/owner-site/components/countries";
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
import { CountryDetailsStyle1 } from "./country-details-style/country-details-style-1";
import { ComponentResponse } from "@/types/owner-site/components/components";

interface CountryDetailsComponentProps {
  component: ComponentResponse<"country_details">;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (
    componentId: string,
    newData: ComponentResponse<"country_details">
  ) => void;
  onReplace?: (componentId: string, category?: string) => void;
}

export const CountryDetailsComponent: React.FC<
  CountryDetailsComponentProps
> = ({
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
    "country_details"
  );
  const updateComponent = useUpdateComponentMutation(
    pageSlug || "",
    "country_details"
  );

  const handleUpdate = (updatedData: Partial<CountryDetailsData>) => {
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
    const style = component.data?.style || "style-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "style-1":
      default:
        return <CountryDetailsStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReplace?.(component.component_id, "country-details-sections")}
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
                <AlertDialogTitle>
                  Delete Country Details Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this country details
                  component? This action cannot be undone.
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
