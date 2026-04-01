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
import { X, Search, Plus } from "lucide-react";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { useDebouncedCallback } from "use-debounce";
import { TestimonialsHeader } from "./testimonial-header";
import { TestimonialsTable } from "./testimonial-table";
import { TestimonialModal } from "./testimonial-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const ITEMS_PER_PAGE = 10;

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

  const handleDelete = (testimonial: any): void => {
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
      console.error("Submit failed:", error);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const filteredTestimonials = (testimonials || []).filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.comment.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedTestimonials = filteredTestimonials.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);

  if (testimonialsError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="rounded-lg bg-white p-12 text-center">
            <h2 className="text-sm font-medium text-red-600">
              Error Loading Testimonials
            </h2>
            <p className="mt-2 text-xs text-black/40">
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Header Section */}
        <TestimonialsHeader />

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search by name..."
              value={searchInput}
              onChange={handleSearchChange}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={handleAdd}
            className="h-9 rounded-lg bg-black px-4 font-semibold text-white transition-all hover:bg-black/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </div>

        {/* Content */}
        <TestimonialsTable
          testimonials={paginatedTestimonials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoadingTestimonials}
        />

        {!isLoadingTestimonials && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
            <div className="text-[10px] text-black/40">
              Showing {filteredTestimonials.length} results
            </div>
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

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
