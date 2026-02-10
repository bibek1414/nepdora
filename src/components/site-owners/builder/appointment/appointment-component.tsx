"use client";
import React, { useState } from "react";
import { AppointmentComponentData } from "@/types/owner-site/components/appointment";
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
import { AppointmentStyle1 } from "./appointment-style/appointment-style-1";
import { AppointmentStyle2 } from "./appointment-style/appointment-style-2";
import { AppointmentStyle3 } from "./appointment-style/appointment-style-3";

interface AppointmentComponentProps {
  component: AppointmentComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: AppointmentComponentData) => void;
  onReplace?: (componentId: string) => void;
}

export const AppointmentComponent: React.FC<AppointmentComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteAppointmentComponent = useDeleteComponentMutation(
    pageSlug || "",
    "appointment"
  );
  const updateAppointmentComponent = useUpdateComponentMutation(
    pageSlug || "",
    "appointment"
  );

  const handleUpdate = (
    updatedData: Partial<AppointmentComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateAppointmentComponent.mutate({
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
    deleteAppointmentComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderAppointmentStyle = () => {
    const style = component.data?.style || "appointment-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "appointment-2":
        return <AppointmentStyle2 {...commonProps} />;
      case "appointment-3":
        return <AppointmentStyle3 {...commonProps} />;
      case "appointment-1":
      default:
        return <AppointmentStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/appointments/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Appointments
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
              disabled={deleteAppointmentComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteAppointmentComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Appointment Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this appointment component?
                  This action cannot be undone.
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
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderAppointmentStyle()}
    </div>
  );
};
