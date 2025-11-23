import { useEffect } from "react";
import { TestimonialModalProps } from "@/types/owner-site/admin/testimonial";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TestimonialForm from "./testimonial-form";

export const TestimonialModal = ({
  isOpen,
  onClose,
  testimonial,
  onSubmit,
  isLoading,
}: TestimonialModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <TestimonialForm
          testimonial={testimonial}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
