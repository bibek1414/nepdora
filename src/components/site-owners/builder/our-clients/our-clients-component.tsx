"use client";
import React, { useState } from "react";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";
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
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { OurClientsStyle1 } from "./our-clients-style-1";
import { OurClientsStyle2 } from "./our-clients-style-2";
import { OurClientsStyle3 } from "./our-clients-style-3";
import { OurClientsStyle4 } from "./our-clients-style-4";

interface OurClientsComponentProps {
  component: OurClientsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: OurClientsComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const OurClientsComponent: React.FC<OurClientsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteOurClientsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "our_clients"
  );
  const updateOurClientsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "our_clients"
  );

  const handleUpdate = (
    updatedData: Partial<OurClientsComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateOurClientsComponent.mutate({
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
    deleteOurClientsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderOurClientsStyle = () => {
    const style = component.data?.style || "our-clients-1";
    const commonProps = {
      data: component.data,
      isEditable,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "our-clients-4":
        return <OurClientsStyle4 {...commonProps} />;
      case "our-clients-2":
        return <OurClientsStyle2 {...commonProps} />;
      case "our-clients-3":
        return <OurClientsStyle3 {...commonProps} />;
      case "our-clients-1":
      default:
        return <OurClientsStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/our-clients/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Our Clients
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
              disabled={deleteOurClientsComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteOurClientsComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Our Clients Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this component? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteOurClientsComponent.isPending}
                >
                  {deleteOurClientsComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderOurClientsStyle()}
    </div>
  );
};
