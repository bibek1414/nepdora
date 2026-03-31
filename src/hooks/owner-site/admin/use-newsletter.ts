import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsletterApi } from "@/services/api/owner-sites/admin/newsletter";
import {
  CreateNewsletterRequest,
  Newsletter,
} from "@/types/owner-site/admin/newsletter";
import { toast } from "sonner";

// Query Keys
export const newsletterKeys = {
  all: ["newsletter"] as const,
  lists: () => [...newsletterKeys.all, "list"] as const,
  list: (page: number, pageSize: number, search: string) =>
    [...newsletterKeys.lists(), { page, pageSize, search }] as const,
};

// Get all newsletter subscriptions
export const useNewsletters = (page = 1, pageSize = 10, search = "") => {
  return useQuery({
    queryKey: newsletterKeys.list(page, pageSize, search),
    queryFn: () => newsletterApi.getNewsletters(page, pageSize, search),
  });
};

// Create newsletter subscription
export const useCreateNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewsletterRequest) =>
      newsletterApi.createNewsletter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
    },
  });
};

export const useUpdateNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Newsletter> }) =>
      newsletterApi.updateNewsletter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update newsletter:", error);
    },
  });
};

export const useDeleteNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: newsletterApi.deleteNewsletter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
      toast.success("Newsletter subscription deleted successfully");
    },
    onError: error => {
      toast.error("Failed to delete newsletter");
      console.error("Delete newsletter error:", error);
    },
  });
};
