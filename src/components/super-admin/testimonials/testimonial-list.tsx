"use client";

import { useState } from "react";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/super-admin/use-testimonials";
import {
  Testimonial,
  CreateTestimonialData,
} from "@/types/owner-site/admin/testimonial";
import { X, Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { TestimonialsHeader } from "./testimonial-header";
import { TestimonialsTable } from "./testimonial-table";
import { TestimonialModal } from "./testimonial-modal";
import { Input } from "@/components/ui/input";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { toast } from "sonner";

export default function TestimonialList() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] =
    useState<Testimonial | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  // TanStack Query hooks
  const {
    data: testimonials = [],
    isLoading: isLoadingTestimonials,
    error: testimonialsError,
  } = useTestimonials();

  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  }, 500);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };
  const handleAdd = (): void => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial: Testimonial): void => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (testimonial: Testimonial): void => {
    setTestimonialToDelete(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!testimonialToDelete) return;

    try {
      await deleteMutation.mutateAsync(testimonialToDelete.id);
      toast.success("Testimonial deleted successfully");
      setIsDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete testimonial");
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
        <div className="mt-10 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name..."
              value={searchInput}
              onChange={handleSearchChange}
              className="border-gray-200 bg-white pr-10 pl-10 placeholder:text-gray-500 focus:border-gray-300 focus:ring-0"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
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

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          isLoading={deleteMutation.isPending}
          title="Delete Testimonial"
          description={`Are you sure you want to delete the testimonial from "${testimonialToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
}
