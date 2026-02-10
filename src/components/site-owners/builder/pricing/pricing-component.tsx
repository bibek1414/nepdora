"use client";
import React, { useState } from "react";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
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
import { PricingStyle1 } from "./pricing-style/pricing-style-1";
import { PricingStyle2 } from "./pricing-style/pricing-style-2";
import { PricingStyle3 } from "./pricing-style/pricing-style-3";
import { PricingStyle4 } from "./pricing-style/pricing-style-4";

interface PricingComponentProps {
  component: PricingComponentData;
  isEditable?: boolean;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: PricingComponentData) => void;
  onPricingClick?: (pricingId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const PricingComponent: React.FC<PricingComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  onUpdate,
  onPricingClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deletePricingComponent = useDeleteComponentMutation(
    pageSlug || "",
    "pricing"
  );
  const updatePricingComponent = useUpdateComponentMutation(
    pageSlug || "",
    "pricing"
  );

  const handleUpdate = (updatedData: Partial<PricingComponentData["data"]>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updatePricingComponent.mutate({
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
    deletePricingComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderPricingStyle = () => {
    const style = component.data?.style || "pricing-1";
    const commonProps = {
      data: component.data,
      isEditable,
      onUpdate: handleUpdate,
      onPricingClick: (pricingId: number) => {
        if (onPricingClick && component.order !== undefined) {
          onPricingClick(pricingId, component.order);
        }
      },
    };

    switch (style) {
      case "pricing-2":
        return <PricingStyle2 {...commonProps} />;
      case "pricing-3":
        return <PricingStyle3 {...commonProps} />;
      case "pricing-4":
        return <PricingStyle4 {...commonProps} />;
      case "pricing-1":
      default:
        return <PricingStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/pricing/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Pricing
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
              disabled={deletePricingComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deletePricingComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Pricing Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this pricing component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletePricingComponent.isPending}
                >
                  {deletePricingComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderPricingStyle()}
    </div>
  );
};
