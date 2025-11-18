import React, { useState } from "react";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { ServicesCard1 } from "./services-card1";
import { ServicesCard2 } from "./services-card2";
import { ServicesCard3 } from "./services-card3";
import { ServicesCard4 } from "./services-card4";
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
import { AlertCircle, Trash2, Briefcase } from "lucide-react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditableText } from "@/components/ui/editable-text";
import { toast } from "sonner";

interface ServicesComponentProps {
  component: ServicesComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ServicesComponentData) => void;
  onServiceClick?: (serviceSlug: string, order: number) => void;
}

export const ServicesComponent: React.FC<ServicesComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onServiceClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    page_size = 6,
    title = "Latest Services",
    subtitle,
    style = "services-1",
    showDate = true,
  } = component.data || {};

  // Delete and update mutation hooks - changed from 'blog' to 'services'
  const deleteServicesComponent = useDeleteComponentMutation(
    pageSlug || "",
    "services"
  );
  const updateServicesComponent = useUpdateComponentMutation(
    pageSlug || "",
    "services"
  );

  // Calculate page size and get first page for the page_size
  const pageSize = Math.min(page_size, 50);

  const { data, isLoading, error } = useServices({
    page: 1,
    page_size: pageSize,
  });

  // Extract services from the API response structure
  const services = data?.results || [];
  const totalServices = data?.count || 0;

  const hasNext = data?.next !== null;
  const hasPrevious = data?.previous !== null;
  const totalPages = Math.ceil(totalServices / pageSize);

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    updateServicesComponent.mutate(
      {
        componentId,
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
      onUpdate(componentId, {
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

    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    updateServicesComponent.mutate(
      {
        componentId,
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
      onUpdate(componentId, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const handleServiceClick = (service: ServicesPost) => {
    if (onServiceClick && component.order !== undefined) {
      onServiceClick(service.slug, component.order);
    }
  };

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

    const componentId = component.component_id || component.id?.toString();
    if (componentId) {
      deleteServicesComponent.mutate(componentId);
    }
    setIsDeleteDialogOpen(false);
  };

  const renderServiceCard = (service: ServicesPost) => {
    const cardProps = {
      services: service,
      siteUser: isEditable ? undefined : siteUser,
      showDate,
      onClick: () => handleServiceClick(service),
    };

    switch (style) {
      case "services-2":
        return <ServicesCard2 {...cardProps} />;
      case "services-3":
        return <ServicesCard3 {...cardProps} />;
      case "services-4":
        return <ServicesCard4 {...cardProps} />;
      case "services-1":
      default:
        return <ServicesCard1 {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "services-2":
        return `grid-cols-1 sm:grid-cols-4 sm:grid-cols-1`;
      case "services-3":
        return "grid-cols-1 gap-6";
      case "services-4":
        return `grid-cols-1 lg:grid-cols-4 sm:grid-cols-1 `;
      case "services-1":
      default:
        return `grid-cols-1 sm:grid-cols-4 sm:grid-cols-1`;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute inset-y-4 top-4 -right-5 z-20 translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex items-center gap-2">
              <Link href="/admin/services/" target="_blank" rel="noopener">
                <Button size="sm" variant="outline">
                  Manage Services
                </Button>
              </Link>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3"
                  disabled={deleteServicesComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteServicesComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Services Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this services component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteServicesComponent.isPending}
                >
                  {deleteServicesComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Services Preview */}
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

            {isLoading && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {Array.from({ length: Math.min(page_size, 3) }).map(
                  (_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-[200px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Services</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load services. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && services.length > 0 && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {services.slice(0, Math.min(page_size, 6)).map(service => (
                  <div
                    key={service.id}
                    className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                  >
                    {/* Overlay to prevent clicks in builder mode */}
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    {renderServiceCard(service)}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && services.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <Briefcase className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Services Found
                </h3>
                <p className="text-muted-foreground">
                  Add some services to your site to display them here.
                </p>
              </div>
            )}

            {!isLoading && !error && services.length > 6 && (
              <div className="bg-muted/50 mt-6 rounded-md p-3 text-center">
                <p className="text-muted-foreground text-sm">
                  Showing 6 of {services.length} services in builder preview
                  {totalServices > 0 && ` (${totalServices} total available)`}
                </p>
              </div>
            )}
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

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: page_size }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load Services</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our services. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && services.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {services.slice(0, page_size).map(service => (
              <div key={service.id} className="flex-shrink-0">
                {renderServiceCard(service)}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && services.length === 0 && (
          <div className="py-16 text-center">
            <Briefcase className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Services Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently working on new services. Please check back
              soon for updates.
            </p>
          </div>
        )}

        {/* Pagination info */}
        {!isLoading && !error && totalServices > page_size && (
          <div className="bg-muted/30 mt-12 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              Showing {Math.min(page_size, services.length)} of {totalServices}{" "}
              services
              {totalPages > 1 && ` (Page 1 of ${totalPages})`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
