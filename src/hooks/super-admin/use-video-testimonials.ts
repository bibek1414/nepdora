import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { videoTestimonialsApi } from "@/services/api/super-admin/video-testimonials";
import {
  CreateVideoTestimonialData,
  UpdateVideoTestimonialData,
} from "@/types/super-admin/video-testimonial";
import { toast } from "sonner";

export const useVideoTestimonials = () => {
  return useQuery({
    queryKey: ["video-testimonials"],
    queryFn: () => videoTestimonialsApi.getAll(),
  });
};

export const useCreateVideoTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVideoTestimonialData) =>
      videoTestimonialsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-testimonials"] });
      toast.success("Video testimonial created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create video testimonial");
    },
  });
};

export const useUpdateVideoTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateVideoTestimonialData;
    }) => videoTestimonialsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-testimonials"] });
      toast.success("Video testimonial updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update video testimonial");
    },
  });
};

export const useDeleteVideoTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => videoTestimonialsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-testimonials"] });
      toast.success("Video testimonial deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete video testimonial");
    },
  });
};
