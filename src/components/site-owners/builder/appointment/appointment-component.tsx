import React, { useState } from "react";
import {
  AppointmentComponentData,
  AppointmentData,
} from "@/types/owner-site/components/appointment";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { AppointmentForm1 } from "./appointment-form-1";
import { AppointmentForm2 } from "./appointment-form-2";
import { AppointmentForm3 } from "./appointment-form-3";
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
import { Trash2 } from "lucide-react";

interface AppointmentComponentProps {
  component: AppointmentComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: AppointmentComponentData) => void;
}

export const AppointmentComponent: React.FC<AppointmentComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Book an Appointment",
    subtitle,
    style = "appointment-1",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteAppointmentComponent = useDeleteComponentMutation(
    pageSlug || "",
    "appointment"
  );
  const updateAppointmentComponent = useUpdateComponentMutation(
    pageSlug || "",
    "appointment"
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

    deleteAppointmentComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateAppointmentComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

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

    updateAppointmentComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

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

  const handleDataChange = (newData: AppointmentData) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateAppointmentComponent.mutate({
      componentId: component.component_id,
      data: newData,
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: newData,
      });
    }
  };

  const renderAppointmentForm = () => {
    const formProps = {
      data: component.data,
      siteUser: isEditable ? undefined : siteUser,
      isPreview: isEditable,
      isEditable: isEditable,
      onDataChange: isEditable ? handleDataChange : undefined,
    };

    switch (style) {
      case "appointment-2":
        return <AppointmentForm2 {...formProps} />;
      case "appointment-3":
        return <AppointmentForm3 {...formProps} />;
      case "appointment-1":
      default:
        return <AppointmentForm1 {...formProps} />;
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
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                size="sm"
                className="h-8 px-3"
                disabled={deleteAppointmentComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteAppointmentComponent.isPending
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Appointment Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this appointment component?
                  This action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteAppointmentComponent.isPending}
                >
                  {deleteAppointmentComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Appointment Preview */}
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

            <div className="relative">{renderAppointmentForm()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
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

        {renderAppointmentForm()}
      </div>
    </section>
  );
};
