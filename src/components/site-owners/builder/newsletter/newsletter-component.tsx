import React, { useState } from "react";
import {
  NewsletterComponentData,
  NewsletterData,
} from "@/types/owner-site/components/newsletter";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { NewsletterForm1 } from "./newsletter-form-1";
import { NewsletterForm2 } from "./newsletter-form-2";
import { NewsletterForm3 } from "./newsletter-form-3";
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
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { Trash2, Mail, RefreshCw } from "lucide-react";

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
  const { data: builderData, handleTextUpdate } = useBuilderLogic(
    component.data,
    updatedData => {
      if (onUpdate) {
        onUpdate(component.component_id, {
          ...component,
          data: {
            ...component.data,
            ...updatedData,
          },
        });
      }
    }
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Stay Updated",
    subtitle,
    style = "style-1",
  } = builderData || {};

  // Use unified mutation hooks
  const deleteNewsletterComponent = useDeleteComponentMutation(
    pageSlug || "",
    "newsletter"
  );
  const updateNewsletterComponent = useUpdateComponentMutation(
    pageSlug || "",
    "newsletter"
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deleteNewsletterComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    handleTextUpdate("title")(newTitle);

    if (pageSlug) {
      updateNewsletterComponent.mutate({
        componentId: component.component_id,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    handleTextUpdate("subtitle")(newSubtitle);

    if (pageSlug) {
      updateNewsletterComponent.mutate({
        componentId: component.component_id,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const handleDataChange = (newData: NewsletterData) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateNewsletterComponent.mutate({
      componentId: component.component_id,
      data: newData,
    });

    // Also update local state if onUpdate is provided
    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: newData,
      });
    }
  };

  const renderNewsletterForm = () => {
    const formProps = {
      data: builderData,
      siteUser: isEditable ? undefined : siteUser,
      isPreview: isEditable,
      isEditable: isEditable,
      onDataChange: isEditable ? handleDataChange : undefined,
    };

    switch (style) {
      case "newsletter-2":
        return <NewsletterForm2 {...formProps} />;
      case "newsletter-3":
        return <NewsletterForm3 {...formProps} />;
      case "newsletter-1":
      default:
        return <NewsletterForm1 {...formProps} />;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReplace?.(component.component_id)}
                className="h-8 w-fit justify-start bg-white px-3"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Replace
              </Button>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 w-fit justify-start px-3"
                  disabled={deleteNewsletterComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteNewsletterComponent.isPending
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Newsletter Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this newsletter component?
                  This action cannot be undone and will permanently remove the
                  component from your page.
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
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Newsletter Preview */}
        {/* Show title/subtitle editing for form-1 and form-3 styles */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* {style === "style-1" && (
              <div className="mb-8 text-center">
                <EditableText
                  value={title}
                  onChange={handleTitleChange}
                  as="h2"
                  className="text-foreground mb-2 text-3xl font-bold tracking-tight"
                  isEditable={true}
                  placeholder="Enter title..."
                />
                {subtitle !== undefined && (
                  <EditableText
                    value={subtitle || ""}
                    onChange={handleSubtitleChange}
                    as="p"
                    className="text-muted-foreground mx-auto max-w-2xl text-lg"
                    isEditable={true}
                    placeholder="Enter subtitle..."
                    multiline={true}
                  />
                )}
              </div>
            )} */}

            <div className="relative">{renderNewsletterForm()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {renderNewsletterForm()}
      </div>
    </section>
  );
};
