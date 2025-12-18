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
import { X, Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { TestimonialsHeader } from "./testimonial-header";
import { TestimonialsTable } from "./testimonial-table";
import { TestimonialModal } from "./testimonial-modal";
import { Input } from "@/components/ui/input";

export default function TestimonialList() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
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
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        {/* Header Section */}
        <TestimonialsHeader
          onAdd={handleAdd}
          testimonialsCount={testimonials.length}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name..."
              value={searchInput}
              onChange={handleSearchChange}
              className="h-9 border-slate-200 bg-white pr-10 pl-10 text-sm placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-900"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <TestimonialsTable
          testimonials={testimonials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoadingTestimonials}
        />

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
