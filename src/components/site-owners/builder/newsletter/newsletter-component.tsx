"use client";
import React, { useState } from "react";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
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
import { NewsletterStyle1 } from "./newsletter-style-1";
import { NewsletterStyle2 } from "./newsletter-style-2";
import { NewsletterStyle3 } from "./newsletter-style-3";

interface NewsletterComponentProps {
  component: NewsletterComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: NewsletterComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const NewsletterComponent: React.FC<NewsletterComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteNewsletterComponent = useDeleteComponentMutation(
    pageSlug || "",
    "newsletter"
  );
  const updateNewsletterComponent = useUpdateComponentMutation(
    pageSlug || "",
    "newsletter"
  );

  const handleUpdate = (
    updatedData: Partial<NewsletterComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateNewsletterComponent.mutate({
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
    deleteNewsletterComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderNewsletterStyle = () => {
    const style = component.data?.style || "newsletter-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "newsletter-2":
        return <NewsletterStyle2 {...commonProps} />;
      case "newsletter-3":
        return <NewsletterStyle3 {...commonProps} />;
      case "newsletter-1":
      default:
        return <NewsletterStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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
              disabled={deleteNewsletterComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteNewsletterComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Newsletter Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this newsletter component?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteNewsletterComponent.isPending}
                >
                  {deleteNewsletterComponent.isPending
                    ? "Deleting..."
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderNewsletterStyle()}
    </div>
  );
};
