"use client";
import React, { useState } from "react";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
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
import { PortfolioStyle1 } from "./portfolio-style/portfolio-style-1";
import { PortfolioStyle2 } from "./portfolio-style/portfolio-style-2";
import { PortfolioStyle3 } from "./portfolio-style/portfolio-style-3";
import { PortfolioStyle4 } from "./portfolio-style/portfolio-style-4";

interface PortfolioComponentProps {
  component: PortfolioComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onUpdate?: (componentId: string, newData: PortfolioComponentData) => void;
  onPortfolioClick?: (portfolioSlug: string, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const PortfolioComponent: React.FC<PortfolioComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onUpdate,
  onPortfolioClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deletePortfolioMutation = useDeleteComponentMutation(
    pageSlug,
    "portfolio"
  );
  const updatePortfolioMutation = useUpdateComponentMutation(
    pageSlug,
    "portfolio"
  );

  const handleUpdate = (
    updatedData: Partial<PortfolioComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id || component.id.toString();

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updatePortfolioMutation.mutate({
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
    const componentId = component.component_id || component.id.toString();
    deletePortfolioMutation.mutate(componentId);
    setIsDeleteDialogOpen(false);
  };

  const renderPortfolioStyle = () => {
    const style = component.data?.style || "portfolio-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onPortfolioClick: (slug: string) => {
        if (onPortfolioClick && component.order !== undefined) {
          onPortfolioClick(slug, component.order);
        }
      },
    };

    switch (style) {
      case "portfolio-2":
        return <PortfolioStyle2 {...commonProps} />;
      case "portfolio-3":
        return <PortfolioStyle3 {...commonProps} />;
      case "portfolio-4":
        return <PortfolioStyle4 {...commonProps} />;
      case "portfolio-1":
      default:
        return <PortfolioStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/portfolio/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Portfolio
            </Button>
          </Link>

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

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              size="sm"
              className="h-8 w-fit justify-start px-3"
              disabled={deletePortfolioMutation.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deletePortfolioMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Portfolio Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this portfolio component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletePortfolioMutation.isPending}
                >
                  {deletePortfolioMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderPortfolioStyle()}
    </div>
  );
};
