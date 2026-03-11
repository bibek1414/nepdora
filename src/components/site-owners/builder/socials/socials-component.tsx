"use client";

import React, { useState } from "react";
import { SocialsComponentData } from "@/types/owner-site/components/socials";
import { SocialsStyle1 } from "./socials-style-1";
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
import { Trash2, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SocialsComponentProps {
  component: SocialsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onReplace?: (componentId: string) => void;
}

export const SocialsComponent: React.FC<SocialsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteSocialsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "socials"
  );
  const updateSocialsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "socials"
  );

  const handleUpdate = (updatedData: Partial<SocialsComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;
    if (!componentId) return;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateSocialsComponent.mutate({
      componentId,
      data: newData as any,
    });
  };

  const handleConfirmDelete = () => {
    const componentId = component.component_id;
    if (!pageSlug || !componentId) return;
    deleteSocialsComponent.mutate(componentId);
    setIsDeleteDialogOpen(false);
  };

  if (!component) return null;

  const data = component.data;
  const { template } = data;

  const renderSocialsStyle = () => {
    const commonProps = {
      data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (template) {
      case "socials-style-1":
        return <SocialsStyle1 {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href="/admin/settings/site-config"
            target="_blank"
            rel="noopener"
          >
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start whitespace-nowrap"
            >
              <Settings className="mr-1 h-4 w-4" />
              Manage Socials
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (component.component_id) {
                onReplace?.(component.component_id);
              }
            }}
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
              disabled={deleteSocialsComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteSocialsComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Socials Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this socials section? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteSocialsComponent.isPending}
                >
                  {deleteSocialsComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderSocialsStyle()}
    </div>
  );
};
