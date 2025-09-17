"use client";

import { useState } from "react";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/owner-site/admin/use-testimonials";
import {
  Testimonial,
  CreateTestimonialData,
} from "@/types/owner-site/admin/testimonial";

import { TestimonialsHeader } from "./testimonial-header";
import { TestimonialsTable } from "./testimonial-table";
import { TestimonialModal } from "./testimonial-modal";

export default function TestimonialList() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  // TanStack Query hooks
  const {
    data: testimonials = [],
    isLoading: isLoadingTestimonials,
    error: testimonialsError,
  } = useTestimonials();

  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const handleAdd = (): void => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial: Testimonial): void => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Delete failed:", error);
    }
  };

  const handleSubmit = async (
    formData: CreateTestimonialData
  ): Promise<void> => {
    try {
      if (editingTestimonial) {
        await updateMutation.mutateAsync({
          id: editingTestimonial.id,
          data: {
            name: formData.name,
            comment: formData.comment,
            designation: formData.designation || undefined,
            image: formData.image || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          comment: formData.comment,
          designation: formData.designation || undefined,
          image: formData.image || undefined,
        });
      }

      setIsModalOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Submit failed:", error);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (testimonialsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <h2 className="text-lg font-semibold text-red-800">
              Error Loading Testimonials
            </h2>
            <p className="mt-2 text-red-600">
              {testimonialsError instanceof Error
                ? testimonialsError.message
                : "An unexpected error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white">
      {/* Main Container with responsive padding */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header Section */}
        <TestimonialsHeader
          onAdd={handleAdd}
          testimonialsCount={testimonials.length}
        />

        {/* Content Card with responsive design */}
        <div className="overflow-hidden rounded-lg bg-white">
          <TestimonialsTable
            testimonials={testimonials}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoadingTestimonials}
          />
        </div>

        {/* Modal */}
        <TestimonialModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          testimonial={editingTestimonial}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
