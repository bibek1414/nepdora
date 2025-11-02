import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { googleAnalyticsApi } from "@/services/api/owner-sites/admin/google-analytics";
import {
  GoogleAnalytics,
  CreateGoogleAnalyticsRequest,
  UpdateGoogleAnalyticsRequest,
} from "@/types/owner-site/admin/google-analytics";

// Query Keys
export const googleAnalyticsKeys = {
  all: ["google-analytics"] as const,
  lists: () => [...googleAnalyticsKeys.all, "list"] as const,
  list: (filters: string) =>
    [...googleAnalyticsKeys.lists(), { filters }] as const,
  details: () => [...googleAnalyticsKeys.all, "detail"] as const,
  detail: (id: string) => [...googleAnalyticsKeys.details(), id] as const,
};

// Get all Google Analytics configs
export const useGoogleAnalytics = () => {
  return useQuery({
    queryKey: googleAnalyticsKeys.lists(),
    queryFn: googleAnalyticsApi.getGoogleAnalytics,
  });
};

// Get single Google Analytics config
export const useGoogleAnalytic = (id: string) => {
  return useQuery({
    queryKey: googleAnalyticsKeys.detail(id),
    queryFn: () => googleAnalyticsApi.getGoogleAnalytic(id),
    enabled: !!id,
  });
};

// Create Google Analytics config
export const useCreateGoogleAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoogleAnalyticsRequest) =>
      googleAnalyticsApi.createGoogleAnalytics(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: googleAnalyticsKeys.lists() });
    },
  });
};

// Update Google Analytics config
export const useUpdateGoogleAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateGoogleAnalyticsRequest;
    }) => googleAnalyticsApi.updateGoogleAnalytics(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: googleAnalyticsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: googleAnalyticsKeys.detail(variables.id),
      });
    },
  });
};

// Delete Google Analytics config
export const useDeleteGoogleAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => googleAnalyticsApi.deleteGoogleAnalytics(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: googleAnalyticsKeys.lists() });
    },
  });
};
