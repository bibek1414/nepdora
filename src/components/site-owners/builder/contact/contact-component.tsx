"use client";
import React, { useState } from "react";
import { ContactComponentData } from "@/types/owner-site/components/contact";
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
import { ContactStyle1 } from "./contact-style/contact-style-1";
import { ContactStyle2 } from "./contact-style/contact-style-2";
import { ContactStyle3 } from "./contact-style/contact-style-3";
import { ContactStyle4 } from "./contact-style/contact-style-4";
import { ContactStyle5 } from "./contact-style/contact-style-5";
import { ContactStyle6 } from "./contact-style/contact-style-6";
import { ContactStyle7 } from "./contact-style/contact-style-7";
import { ContactStyle8 } from "./contact-style/contact-style-8";
import { ContactStyle9 } from "./contact-style/contact-style-9";

interface ContactComponentProps {
  component: ContactComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ContactComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const ContactComponent: React.FC<ContactComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteContactComponent = useDeleteComponentMutation(
    pageSlug || "",
    "contact"
  );
  const updateContactComponent = useUpdateComponentMutation(
    pageSlug || "",
    "contact"
  );

  const handleUpdate = (updatedData: Partial<ContactComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateContactComponent.mutate({
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
    deleteContactComponent.mutate(component.component_id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const renderContactStyle = () => {
    const style = component.data?.style || "form-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "contact-2":
        return <ContactStyle2 {...commonProps} />;
      case "contact-3":
        return <ContactStyle3 {...commonProps} />;
      case "contact-4":
        return <ContactStyle4 {...commonProps} />;
      case "contact-5":
        return <ContactStyle5 {...commonProps} />;
      case "contact-6":
        return <ContactStyle6 {...commonProps} />;
      case "contact-7":
        return <ContactStyle7 {...commonProps} />;
      case "contact-8":
        return <ContactStyle8 {...commonProps} />;
      case "contact-9":
        return <ContactStyle9 {...commonProps} />;
      case "contact-1":
      default:
        return <ContactStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            onClick={() => onReplace?.(component.component_id)}
            variant="outline"
            size="sm"
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
              disabled={deleteContactComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteContactComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Contact Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this contact component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteContactComponent.isPending}
                >
                  {deleteContactComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderContactStyle()}
    </div>
  );
};
