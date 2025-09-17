import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { youtubeAPI } from "@/services/api/owner-sites/admin/youtube";
import {
  YouTubeVideos,
  YouTubeVideo,
  CreateYouTubeVideoData,
  UpdateYouTubeVideoData,
} from "@/types/owner-site/admin/youtube";

// Get all videos
export const useYouTubeVideos = () => {
  return useQuery<YouTubeVideos, Error>({
    queryKey: ["youtubeVideos"],
    queryFn: youtubeAPI.getVideos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create video hook
export const useCreateYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateYouTubeVideoData) => youtubeAPI.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeVideos"] });
      toast.success("YouTube video added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add YouTube video");
    },
  });
};

// Update video hook
export const useUpdateYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateYouTubeVideoData }) =>
      youtubeAPI.updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeVideos"] });
      toast.success("YouTube video updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update YouTube video");
    },
  });
};

// Delete video hook
export const useDeleteYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => youtubeAPI.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeVideos"] });
      toast.success("YouTube video deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete YouTube video");
    },
  });
};
