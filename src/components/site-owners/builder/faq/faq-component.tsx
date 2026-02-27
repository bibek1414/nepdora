"use client";
import React, { useState } from "react";
import { FAQComponentData } from "@/types/owner-site/components/faq";
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
import { FAQStyle1 } from "./faq-style/faq-style-1";
import { FAQStyle2 } from "./faq-style/faq-style-2";
import { FAQStyle3 } from "./faq-style/faq-style-3";
import { FAQStyle4 } from "./faq-style/faq-style-4";
import { FAQStyle5 } from "./faq-style/faq-style-5";
import { FAQStyle6 } from "./faq-style/faq-style-6";
import { FAQStyle7 } from "./faq-style/faq-style-7";
import { FAQStyle8 } from "./faq-style/faq-style-8";
import { FAQStyle9 } from "./faq-style/faq-style-9";
import { FAQStyle10 } from "./faq-style/faq-style-10";
import { FAQStyle11 } from "./faq-style/faq-style-11";

interface FAQComponentProps {
  component: FAQComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: FAQComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const FAQComponent: React.FC<FAQComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteFAQComponent = useDeleteComponentMutation(pageSlug || "", "faq");
  const updateFAQComponent = useUpdateComponentMutation(pageSlug || "", "faq");

  const handleUpdate = (updatedData: Partial<FAQComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateFAQComponent.mutate({
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
    deleteFAQComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderFAQStyle = () => {
    const style = component.data?.style || "faq-1";
    const commonProps = {
      data: component.data,
      isEditable,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "faq-2":
        return <FAQStyle2 {...commonProps} />;
      case "faq-3":
        return <FAQStyle3 {...commonProps} />;
      case "faq-4":
        return <FAQStyle4 {...commonProps} />;
      case "faq-5":
        return <FAQStyle5 {...commonProps} />;
      case "faq-6":
        return <FAQStyle6 {...commonProps} />;
      case "faq-7":
        return <FAQStyle7 {...commonProps} />;
      case "faq-8":
        return <FAQStyle8 {...commonProps} />;
      case "faq-9":
        return <FAQStyle9 {...commonProps} />;
      case "faq-10":
        return <FAQStyle10 {...commonProps} />;
      case "faq-11":
        return <FAQStyle11 {...commonProps} />;
      case "faq-1":
      default:
        return <FAQStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-20 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/faq/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage FAQ
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
              variant="destructive"
              size="sm"
              className="h-8 w-fit justify-start px-3"
              disabled={deleteFAQComponent.isPending}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteFAQComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete FAQ Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this FAQ component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteFAQComponent.isPending}
                >
                  {deleteFAQComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderFAQStyle()}
    </div>
  );
};
