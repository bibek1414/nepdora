"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Settings } from "lucide-react";
import Link from "next/link";
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
  ToursData,
  isToursTemplate1,
  isToursTemplate2,
} from "@/types/owner-site/components/tours";
import { ToursStyle1 } from "./tours-style-1";
import { ToursStyle2 } from "./tours-style-2";

import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";

interface ToursComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "tours";
  data: ToursData;
  type?: "tours";
  order: number;
  page?: number;
}

interface ToursComponentProps {
  component: ToursComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onReplace?: (componentId: string, categoryId?: string) => void;
}

export const ToursComponent: React.FC<ToursComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteToursMutation = useDeleteComponentMutation(
    pageSlug,
    "tours"
  );
  const updateToursMutation = useUpdateComponentMutation(
    pageSlug,
    "tours"
  );

  const handleUpdate = (updatedData: Partial<ToursData>) => {
    const componentId = component.component_id || component.id.toString();

    updateToursMutation.mutate({
      componentId,
      data: updatedData,
    });
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    deleteToursMutation.mutate(componentId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const renderToursTemplate = () => {
    if (!component.data) {
      return (
        <div className="flex min-h-[20vh] items-center justify-center border border-red-200 bg-red-50 px-4 py-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Error: Missing Tours Data
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

    if (isToursTemplate1(component.data)) {
      return (
        <ToursStyle1 toursData={component.data} {...commonProps} />
      );
    }
    if (isToursTemplate2(component.data)) {
      return (
        <ToursStyle2 toursData={component.data} {...commonProps} />
      );
    }

    // Fallback for unknown templates
    return (
      <div className="flex min-h-[20vh] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-700">
            Unknown Tours Template: {(component.data as any).template}
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
            <Link
              href={`/admin/collections/${(component.data as any).collectionSlug || "tours"}`}
              target="_blank"
              rel="noopener"
            >
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
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteToursMutation.isPending}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteToursMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onReplace?.(
                  component.component_id || component.id.toString(),
                  "tours-sections"
                )
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
                  disabled={deleteToursMutation.isPending}
                >
                  {deleteToursMutation.isPending
                    ? "Deleting..."
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {renderToursTemplate()}
    </div>
  );
};
