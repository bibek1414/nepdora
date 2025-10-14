import React, { useState } from "react";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";
import { FAQCard1 } from "./faq-card-1";
import { FAQCard2 } from "./faq-card-2";
import { FAQCard3 } from "./faq-card-3";
import { FAQCard4 } from "./faq-card-4";
import { FAQCard5 } from "./faq-card-5";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { FAQForm } from "../../admin/faq/faq-form";
import { toast } from "sonner";

interface FAQComponentProps {
  component: FAQComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageId?: string | number;
  onUpdate?: (componentId: string, newData: FAQComponentData) => void;
}

export const FAQComponent: React.FC<FAQComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageId,
  onUpdate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    title = "Frequently Asked Questions",
    subtitle,
    style = "accordion",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteFAQComponent = useDeleteComponentMutation(pageId || "", "faq");
  const updateFAQComponent = useUpdateComponentMutation(pageId || "", "faq");

  // Get FAQ data
  const { data: faqs = [], isLoading, error } = useFAQs();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageId) {
      console.error("pageId is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageId) {
      console.error("pageId is required for deletion");
      return;
    }

    const componentId = component.id;
    if (!componentId) {
      console.error("Component id is required for deletion");
      return;
    }

    deleteFAQComponent.mutate(componentId);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageId) {
      console.error("pageId is required for updating component");
      return;
    }

    const componentId = component.id;
    if (!componentId) {
      console.error("Component id is required for updating");
      return;
    }

    updateFAQComponent.mutate(
      {
        id: componentId,
        data: {
          ...component.data,
          title: newTitle,
        },
      },
      {
        onError: error => {
          toast.error("Failed to update title", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );

    if (onUpdate) {
      onUpdate(componentId.toString(), {
        ...component,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddDialogOpen(true);
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!pageId) {
      console.error("pageId is required for updating component");
      return;
    }

    const componentId = component.id;
    if (!componentId) {
      console.error("Component id is required for updating");
      return;
    }

    updateFAQComponent.mutate(
      {
        id: componentId,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      },
      {
        onError: error => {
          toast.error("Failed to update subtitle", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );

    if (onUpdate) {
      onUpdate(componentId.toString(), {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const renderFAQCard = () => {
    const cardProps = { faqs };

    switch (style) {
      case "card-grid-4":
        return <FAQCard4 {...cardProps} />;
      case "simple":
        return <FAQCard5 {...cardProps} />;
      case "plus-minus":
        return <FAQCard2 {...cardProps} />;
      case "card-grid":
        return <FAQCard3 {...cardProps} />;
      case "accordion":
      default:
        return <FAQCard1 {...cardProps} />;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Add Button */}
          <Button
            onClick={handleAddClick}
            variant="default"
            size="sm"
            className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          >
            <Plus className="mr-1 h-4 w-4" />
            FAQ
          </Button>

          {/* Delete Button */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-3"
                disabled={deleteFAQComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteFAQComponent.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete FAQ Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this FAQ component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteFAQComponent.isPending}
                >
                  {deleteFAQComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* FAQ Form Dialog - Updated to use correct props */}
        <FAQForm
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          mode="create"
        />

        {/* FAQ Preview */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <EditableText
                value={title}
                onChange={handleTitleChange}
                as="h2"
                className="text-foreground mb-2 text-3xl font-bold tracking-tight"
                isEditable={true}
                placeholder="Enter title..."
              />
              <EditableText
                value={subtitle || ""}
                onChange={handleSubtitleChange}
                as="p"
                className="text-muted-foreground mx-auto max-w-2xl text-lg"
                isEditable={true}
                placeholder="Enter subtitle..."
                multiline={true}
              />
            </div>

            <div className="mx-auto max-w-4xl">
              {isLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading FAQs</AlertTitle>
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : "Failed to load FAQs. Please check your API connection."}
                  </AlertDescription>
                </Alert>
              )}

              {!isLoading && !error && faqs.length > 0 && (
                <div className="relative">
                  <div className="absolute inset-0 z-10 bg-transparent" />
                  {renderFAQCard()}
                </div>
              )}

              {!isLoading && !error && faqs.length === 0 && (
                <div className="bg-muted/50 rounded-lg py-12 text-center">
                  <HelpCircle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    No FAQs Found
                  </h3>
                  <p className="text-muted-foreground">
                    Add FAQ items to display them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h2>
          {subtitle && (
            <p
              className="text-muted-foreground mx-auto max-w-3xl text-xl"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            ></p>
          )}
        </div>

        <div className="mx-auto max-w-4xl">
          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-14 w-full rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mx-auto max-w-2xl">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Unable to Load FAQs</AlertTitle>
              <AlertDescription className="text-base">
                {error instanceof Error
                  ? error.message
                  : "We're having trouble loading our FAQs. Please try refreshing the page."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && faqs.length > 0 && renderFAQCard()}

          {!isLoading && !error && faqs.length === 0 && (
            <div className="py-16 text-center">
              <HelpCircle className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
              <h3 className="text-foreground mb-4 text-2xl font-semibold">
                No FAQs Available
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md text-lg">
                Our FAQ section is currently being updated. Please check back
                soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
