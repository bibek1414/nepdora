"use client";
import React, { useState } from "react";
import { ServicesComponentData } from "@/types/owner-site/components/services";
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
import { ServicesStyle1 } from "./services-style/services-style-1";
import { ServicesStyle2 } from "./services-style/services-style-2";
import { ServicesStyle3 } from "./services-style/services-style-3";
import { ServicesStyle4 } from "./services-style/services-style-4";
import { ServicesStyle5 } from "./services-style/services-style-5";
import { ServicesStyle6 } from "./services-style/services-style-6";

interface ServicesComponentProps {
  component: ServicesComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ServicesComponentData) => void;
  onServiceClick?: (serviceSlug: string, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const ServicesComponent: React.FC<ServicesComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onServiceClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteServicesComponent = useDeleteComponentMutation(
    pageSlug || "",
    "services"
  );
  const updateServicesComponent = useUpdateComponentMutation(
    pageSlug || "",
    "services"
  );

  const handleUpdate = (
    updatedData: Partial<ServicesComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateServicesComponent.mutate({
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
    const componentId = component.component_id || component.id?.toString();
    if (componentId) {
      deleteServicesComponent.mutate(componentId);
    }
    setIsDeleteDialogOpen(false);
  };

  const renderServicesStyle = () => {
    const style = component.data?.style || "services-1";
    const commonProps = {
      isEditable,
      siteUser,
      onServiceClick: (serviceSlug: string) => {
        if (onServiceClick && component.order !== undefined) {
          onServiceClick(serviceSlug, component.order);
        }
      },
    };

    switch (style) {
      case "services-2":
        return (
          <ServicesStyle2
            data={component.data}
            {...commonProps}
            onUpdate={handleUpdate}
          />
        );
      case "services-3":
        return (
          <ServicesStyle3
            data={component.data}
            {...commonProps}
            onUpdate={handleUpdate}
          />
        );
      case "services-4":
        return (
          <ServicesStyle4
            data={component.data}
            {...commonProps}
            onUpdate={handleUpdate}
          />
        );
      case "services-5":
        return (
          <ServicesStyle5
            data={component.data}
            {...commonProps}
            onUpdate={handleUpdate}
          />
        );
      case "services-6":
        return (
          <ServicesStyle6
            component={component}
            pageSlug={pageSlug}
            onUpdate={onUpdate}
            {...commonProps}
          />
        );
      case "services-1":
      default:
        return (
          <ServicesStyle1
            data={component.data}
            {...commonProps}
            onUpdate={handleUpdate}
          />
        );
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/services/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Services
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
              disabled={deleteServicesComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteServicesComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Services Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this services component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteServicesComponent.isPending}
                >
                  {deleteServicesComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderServicesStyle()}
    </div>
  );
};
