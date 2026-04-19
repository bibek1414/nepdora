"use client";

import { useState } from "react";
import {
  useVideoTestimonials,
  useCreateVideoTestimonial,
  useUpdateVideoTestimonial,
  useDeleteVideoTestimonial,
} from "@/hooks/super-admin/use-video-testimonials";
import {
  VideoTestimonial,
  CreateVideoTestimonialData,
} from "@/types/super-admin/video-testimonial";
import { VideoTestimonialHeader } from "./video-testimonial-header";
import { VideoTestimonialTable } from "./video-testimonial-table";
import { VideoTestimonialModal } from "./video-testimonial-form";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function VideoTestimonialList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<VideoTestimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<VideoTestimonial | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: testimonials = [], isLoading } = useVideoTestimonials();
  const createMutation = useCreateVideoTestimonial();
  const updateMutation = useUpdateVideoTestimonial();
  const deleteMutation = useDeleteVideoTestimonial();

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.video_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial: VideoTestimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (testimonial: VideoTestimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!testimonialToDelete) return;
    await deleteMutation.mutateAsync(testimonialToDelete.id);
    setIsDeleteDialogOpen(false);
    setTestimonialToDelete(null);
  };

  const handleSubmit = async (formData: CreateVideoTestimonialData) => {
    if (editingTestimonial) {
      await updateMutation.mutateAsync({ id: editingTestimonial.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <VideoTestimonialHeader onAdd={handleAdd} count={testimonials.length} />

      <div className="mt-8 mb-6 relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 rounded-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <VideoTestimonialTable
        testimonials={filteredTestimonials}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <VideoTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonial={editingTestimonial}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Video Testimonial"
        description={`Are you sure you want to delete the video testimonial from "${testimonialToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
