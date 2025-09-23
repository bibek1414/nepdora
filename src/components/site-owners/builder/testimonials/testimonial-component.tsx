import React, { useState } from "react";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";
import { TestimonialCard1 } from "./testimonial-card-1";
import { TestimonialCard2 } from "./testimonial-card-2";
import { TestimonialCard3 } from "./testimonial-card-3";
import { TestimonialCard4 } from "./testimonial-card-4";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Trash2, MessageSquareQuote, Plus } from "lucide-react";
import {
  Testimonial,
  CreateTestimonialData,
} from "@/types/owner-site/admin/testimonial";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import TestimonialForm from "@/components/site-owners/admin/testimonials/testimonial-form";
import { useCreateTestimonial } from "@/hooks/owner-site/admin/use-testimonials";

interface TestimonialsComponentProps {
  component: TestimonialsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: TestimonialsComponentData) => void;
  onTestimonialClick?: (testimonialId: number, order: number) => void;
}

export const TestimonialsComponent: React.FC<TestimonialsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onTestimonialClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    page_size = 6,
    title = "What Our Clients Say",
    subtitle,
    style = "grid-1",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteTestimonialsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "testimonials"
  );
  const updateTestimonialsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "testimonials"
  );

  // Testimonial mutations
  const createTestimonialMutation = useCreateTestimonial();

  // Get testimonials
  const { data: testimonials = [], isLoading, error } = useTestimonials();

  const handleTestimonialClick = (testimonial: Testimonial) => {
    if (onTestimonialClick && component.order !== undefined) {
      onTestimonialClick(testimonial.id, component.order);
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

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deleteTestimonialsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleCreateTestimonial = (data: CreateTestimonialData) => {
    createTestimonialMutation.mutate(data, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create testimonial:", error);
      },
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateTestimonialsComponent.mutate({
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

    updateTestimonialsComponent.mutate({
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

  const renderTestimonialCard = (testimonial: Testimonial) => {
    const cardProps = {
      testimonial,
      onClick: () => handleTestimonialClick(testimonial),
    };

    switch (style) {
      case "grid-2":
        return <TestimonialCard2 key={testimonial.id} {...cardProps} />;
      case "grid-3":
        return <TestimonialCard4 key={testimonial.id} {...cardProps} />;
      case "list-1":
        return <TestimonialCard3 key={testimonial.id} {...cardProps} />;
      case "grid-1":
      default:
        return <TestimonialCard1 key={testimonial.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

      case "list-1":
        return "grid-cols-1 lg:grid-cols-3 gap-8";
      case "grid-1":
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Control Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 transition-opacity">
          {/* Add Button */}
          <Button
            onClick={handleAddClick}
            variant="default"
            size="sm"
            className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          >
            <Plus className="mr-1 h-4 w-4" />
            Testimonial
          </Button>

          {/* Delete Button */}
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
                disabled={deleteTestimonialsComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteTestimonialsComponent.isPending
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Testimonials Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this testimonials component?
                  This action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteTestimonialsComponent.isPending}
                >
                  {deleteTestimonialsComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Add Testimonial Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
            </DialogHeader>
            <TestimonialForm
              onSubmit={handleCreateTestimonial}
              onCancel={() => setIsAddDialogOpen(false)}
              isLoading={createTestimonialMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Testimonials Preview */}
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
                {Array.from({ length: Math.min(page_size, 6) }).map(
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
                <AlertTitle>Error Loading Testimonials</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load testimonials. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && testimonials.length > 0 && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {testimonials.slice(0, page_size).map(testimonial => (
                  <div
                    key={testimonial.id}
                    className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                  >
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    {renderTestimonialCard(testimonial)}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && testimonials.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <MessageSquareQuote className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Testimonials Found
                </h3>
                <p className="text-muted-foreground">
                  Add testimonials to display them here.
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
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: page_size }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[240px] w-full rounded-lg" />
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
            <AlertTitle>Unable to Load Testimonials</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading testimonials. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && testimonials.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {testimonials
              .slice(0, page_size)
              .map(testimonial => renderTestimonialCard(testimonial))}
          </div>
        )}

        {!isLoading && !error && testimonials.length === 0 && (
          <div className="py-16 text-center">
            <MessageSquareQuote className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Testimonials Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Customer testimonials will be displayed here once available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
