import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { videosAPI } from "@/services/api/owner-sites/admin/videos";
import {
  Videos,
  CreateVideoData,
  UpdateVideoData,
} from "@/types/owner-site/admin/videos";

// Get all videos
export const useVideos = () => {
  return useQuery<Videos, Error>({
    queryKey: ["videos"],
    queryFn: videosAPI.getVideos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create video hook
export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVideoData) => videosAPI.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add video");
    },
  });
};

// Update video hook
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVideoData }) =>
      videosAPI.updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update video");
    },
  });
};

// Delete video hook
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => videosAPI.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete video");
    },
  });
};
