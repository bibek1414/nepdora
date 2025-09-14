import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import {
  PortfolioData,
  PortfolioComponentData,
} from "@/types/owner-site/components/portfolio";
import { PortfolioCard1 } from "./portfolio-card-1";
import { PortfolioCard2 } from "./portfolio-card-2";
import { PortfolioCard3 } from "./portfolio-card-3";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";

interface PortfolioComponentProps {
  component: PortfolioComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onUpdate?: (componentId: string, newData: PortfolioComponentData) => void;
}

export const PortfolioComponent: React.FC<PortfolioComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
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

  const handleUpdate = (updatedData: Partial<PortfolioData>) => {
    const componentId = component.component_id || component.id.toString();

    updatePortfolioMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          toast.error("Failed to update portfolio section", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();
    const loadingToast = toast.loading("Deleting portfolio section...");

    deletePortfolioMutation.mutate(componentId, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Portfolio section deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete portfolio section", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      },
    });
  };

  const renderPortfolioCard = () => {
    if (!component.data) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center border border-red-200 bg-red-50 px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Error: Missing Portfolio Data
            </h2>
            <p className="mt-2 text-red-500">Component ID: {component.id}</p>
          </div>
        </div>
      );
    }

    const props = {
      portfolioData: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    const Card = component.data.style || "portfolio-1";

    switch (Card) {
      case "portfolio-1":
        return <PortfolioCard1 {...props} />;
      case "portfolio-2":
        return <PortfolioCard2 {...props} />;
      case "portfolio-3":
        return <PortfolioCard3 {...props} />;
      default:
        return (
          <div className="flex min-h-[60vh] items-center justify-center border border-yellow-200 bg-yellow-50 px-4 py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-700">
                Unknown Portfolio Card: {Card}
              </h2>
              <p className="mt-2 text-yellow-600">
                Please select a valid Card in settings.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="group relative">
      {/* Edit Controls - Only show when editable */}
      {isEditable && (
        <>
          <div className="bg-background/80 absolute top-4 right-4 z-20 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deletePortfolioMutation.isPending}
              className=""
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Portfolio Section</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this portfolio section? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletePortfolioMutation.isPending}
                >
                  {deletePortfolioMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Portfolio Card Render */}
      {renderPortfolioCard()}
    </div>
  );
};
