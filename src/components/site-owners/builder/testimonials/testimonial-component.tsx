"use client";
import React, { useState } from "react";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
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
import { TestimonialStyle1 } from "./testimonial-style/testimonial-style-1";
import { TestimonialStyle2 } from "./testimonial-style/testimonial-style-2";
import { TestimonialStyle3 } from "./testimonial-style/testimonial-style-3";
import { TestimonialStyle4 } from "./testimonial-style/testimonial-style-4";
import { TestimonialStyle5 } from "./testimonial-style/testimonial-style-5";
import { TestimonialStyle6 } from "./testimonial-style/testimonial-style-6";
import { TestimonialStyle7 } from "./testimonial-style/testimonial-style-7";
import { TestimonialStyle8 } from "./testimonial-style/testimonial-style-8";
import { TestimonialStyle9 } from "./testimonial-style/testimonial-style-9";
import { TestimonialStyle10 } from "./testimonial-style/testimonial-style-10";
import { TestimonialStyle11 } from "./testimonial-style/testimonial-style-11";
import { TestimonialStyle12 } from "./testimonial-style/testimonial-style-12";

interface TestimonialsComponentProps {
  component: TestimonialsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: TestimonialsComponentData) => void;
  onTestimonialClick?: (testimonialId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const TestimonialsComponent: React.FC<TestimonialsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onTestimonialClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteTestimonialsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "testimonials"
  );
  const updateTestimonialsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "testimonials"
  );

  const handleUpdate = (
    updatedData: Partial<TestimonialsComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateTestimonialsComponent.mutate({
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
    deleteTestimonialsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderTestimonialStyle = () => {
    const style = component.data?.style || "testimonial-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onTestimonialClick: (testimonialId: number) => {
        if (onTestimonialClick && component.order !== undefined) {
          onTestimonialClick(testimonialId, component.order);
        }
      },
    };

    switch (style) {
      case "testimonial-2":
        return <TestimonialStyle2 {...commonProps} />;
      case "testimonial-3":
        return <TestimonialStyle3 {...commonProps} />;
      case "testimonial-4":
        return <TestimonialStyle4 {...commonProps} />;
      case "testimonial-5":
        return <TestimonialStyle5 {...commonProps} />;
      case "testimonial-6":
        return <TestimonialStyle6 {...commonProps} />;
      case "testimonial-7":
        return <TestimonialStyle7 {...commonProps} />;
      case "testimonial-8":
        return <TestimonialStyle8 {...commonProps} />;
      case "testimonial-9":
        return <TestimonialStyle9 {...commonProps} />;
      case "testimonial-10":
        return <TestimonialStyle10 {...commonProps} />;
      case "testimonial-11":
        return <TestimonialStyle11 {...commonProps} />;
      case "testimonial-12":
        return <TestimonialStyle12 {...commonProps} />;
      case "testimonial-1":
      default:
        return <TestimonialStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/testimonials/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Testimonials
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
              disabled={deleteTestimonialsComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteTestimonialsComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Testimonials Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this testimonials component?
                  This action cannot be undone.
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
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderTestimonialStyle()}
    </div>
  );
};
