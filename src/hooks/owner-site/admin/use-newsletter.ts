import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsletterApi } from "@/services/api/owner-sites/admin/newsletter";
import {
  Newsletter,
  CreateNewsletterRequest,
} from "@/types/owner-site/admin/newsletter";

// Query Keys
export const newsletterKeys = {
  all: ["newsletter"] as const,
  lists: () => [...newsletterKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...newsletterKeys.lists(), { page, pageSize }] as const,
};

// Get all newsletter subscriptions
export const useNewsletters = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: newsletterKeys.list(page, pageSize),
    queryFn: () => newsletterApi.getNewsletters(page, pageSize),
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
