import React, { useState } from "react";
import {
  ContactComponentData,
  ContactData,
} from "@/types/owner-site/components/contact";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";
import { ContactForm1 } from "./contact-form-1";
import { ContactForm2 } from "./contact-form-2";
import { ContactForm3 } from "./contact-form-3";
import { ContactForm4 } from "./contact-form-4";
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
import { Trash2, Mail } from "lucide-react";

interface ContactComponentProps {
  component: ContactComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ContactComponentData) => void;
}

export const ContactComponent: React.FC<ContactComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Get in Touch",
    subtitle,
    style = "form-1",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteContactComponent = useDeleteComponentMutation(
    pageSlug || "",
    "contact"
  );
  const updateContactComponent = useUpdateComponentMutation(
    pageSlug || "",
    "contact"
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

    deleteContactComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateContactComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

    // Also update local state if onUpdate is provided
    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateContactComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

    // Also update local state if onUpdate is provided
    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const handleDataChange = (newData: ContactData) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateContactComponent.mutate({
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

  const renderContactForm = () => {
    const formProps = {
      data: component.data,
      siteUser: isEditable ? undefined : siteUser,
      isPreview: isEditable,
      isEditable: isEditable,
      onDataChange: isEditable ? handleDataChange : undefined,
    };

    switch (style) {
      case "form-2":
        return <ContactForm2 {...formProps} />;
      case "form-3":
        return <ContactForm3 {...formProps} />;
      case "form-4":
        return <ContactForm4 {...formProps} />;
      case "form-1":
      default:
        return <ContactForm1 {...formProps} />;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                size="sm"
                className="h-8 px-3"
                disabled={deleteContactComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteContactComponent.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Contact Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this contact component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteContactComponent.isPending}
                >
                  {deleteContactComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Contact Preview */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Only show title/subtitle editing for non-form-4 styles */}
            {style !== "form-4" && (
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
            )}

            <div className="relative">{renderContactForm()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Only show title/subtitle for non-form-4 styles */}
        {style !== "form-4" && (
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {renderContactForm()}
      </div>
    </section>
  );
};
