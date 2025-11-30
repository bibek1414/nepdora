import React, { useState } from "react";
import {
  OurClientsComponentData,
  OurClientsData,
} from "@/types/owner-site/components/our-client";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { OurClients1 } from "./our-clients-1";
import { OurClients2 } from "./our-clients-2";
import { OurClients3 } from "./our-clients-3";
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

interface OurClientsComponentProps {
  component: OurClientsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: OurClientsComponentData) => void;
}

export const OurClientsComponent: React.FC<OurClientsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Our Clients",
    subtitle,
    style = "our-clients-1",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteOurClientsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "our_clients"
  );
  const updateOurClientsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "our_clients"
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

    deleteOurClientsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateOurClientsComponent.mutate({
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
    updateOurClientsComponent.mutate({
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

  const renderOurClients = () => {
    const props = {
      data: component.data,
    };

    switch (style) {
      case "our-clients-2":
        return <OurClients2 {...props} />;
      case "our-clients-3":
        return <OurClients3 {...props} />;
      case "our-clients-1":
      default:
        return <OurClients1 {...props} />;
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
                disabled={deleteOurClientsComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteOurClientsComponent.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Our Clients Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this component? This action
                  cannot be undone and will permanently remove the component
                  from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteOurClientsComponent.isPending}
                >
                  {deleteOurClientsComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Preview */}
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

            <div className="relative">{renderOurClients()}</div>
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
            <div className="mb-10 flex items-center justify-center gap-3 opacity-80">
              <p
                className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              ></p>
            </div>
          )}
        </div>

        {renderOurClients()}
      </div>
    </section>
  );
};
