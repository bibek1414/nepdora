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
  OthersData,
  isOthersTemplate1,
  isOthersTemplate2,
  isOthersTemplate3,
  isOthersTemplate4,
} from "@/types/owner-site/components/others";
import { OthersTemplate1 } from "./others-style-1";
import { OthersTemplate2 } from "./others-style-2";
import { OthersTemplate3 } from "./others-style-3";
import { OthersTemplate4 } from "./others-style-4";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";

interface OthersComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "others";
  data: OthersData;
  type?: "others";
  order: number;
  page?: number;
}

interface OthersComponentProps {
  component: OthersComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onReplace?: (componentId: string) => void;
}

export const OthersComponent: React.FC<OthersComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteOthersMutation = useDeleteComponentMutation(pageSlug, "others");
  const updateOthersMutation = useUpdateComponentMutation(pageSlug, "others");

  const handleUpdate = (updatedData: Partial<OthersData>) => {
    const componentId = component.component_id || component.id.toString();

    updateOthersMutation.mutate({
      componentId,
      data: updatedData,
    });
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    deleteOthersMutation.mutate(componentId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const renderOthersTemplate = () => {
    if (!component.data) {
      return (
        <div className="flex min-h-[20vh] items-center justify-center border border-red-200 bg-red-50 px-4 py-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Error: Missing Others Data
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

    if (isOthersTemplate1(component.data)) {
      return <OthersTemplate1 othersData={component.data} {...commonProps} />;
    }
    if (isOthersTemplate2(component.data)) {
      return <OthersTemplate2 othersData={component.data} {...commonProps} />;
    }
    if (isOthersTemplate3(component.data)) {
      return <OthersTemplate3 othersData={component.data} {...commonProps} />;
    }
    if (isOthersTemplate4(component.data)) {
      return <OthersTemplate4 othersData={component.data} {...commonProps} />;
    }

    // Fallback for unknown templates
    return (
      <div className="flex min-h-[20vh] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-700">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            Unknown Others Template: {(component.data as any).template}
          </h2>
          <p className="mt-2 text-yellow-600">
            Please select a valid template.
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
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteOthersMutation.isPending}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteOthersMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
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
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this section? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteOthersMutation.isPending}
                >
                  {deleteOthersMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderOthersTemplate()}
    </div>
  );
};
