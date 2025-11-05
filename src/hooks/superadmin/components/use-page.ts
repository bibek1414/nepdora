"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pageApi } from "@/services/api/super-admin/components/page";
import {
  CreatePageRequest,
  UpdatePageRequest,
  Page,
} from "@/types/super-admin/page";

export const PAGES_QUERY_KEY = ["pages"];
export const PAGE_QUERY_KEY = (slug: string) => ["pages", slug];

// Get all pages
export const usePages = () => {
  return useQuery({
    queryKey: PAGES_QUERY_KEY,
    queryFn: pageApi.getPages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single page by slug
export const usePage = (slug: string) => {
  return useQuery({
    queryKey: PAGE_QUERY_KEY(slug),
    queryFn: () => pageApi.getPage(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create new page
export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageData: CreatePageRequest) => pageApi.createPage(pageData),

    onSuccess: (data: Page) => {
      console.log("Page created successfully:", data);

      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });

      queryClient.setQueryData(PAGE_QUERY_KEY(data.slug), data);
    },

    onError: error => {
      console.error("Failed to create page:", error);
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdatePageRequest }) =>
      pageApi.updatePage(slug, data),

    onSuccess: (data: Page, variables) => {
      console.log("Page updated successfully:", data);

      // Update the specific page in cache
      queryClient.setQueryData(PAGE_QUERY_KEY(variables.slug), data);

      // If slug changed, also update the pages list
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });

      // If slug changed, remove old cache entry
      if (data.slug !== variables.slug) {
        queryClient.removeQueries({ queryKey: PAGE_QUERY_KEY(variables.slug) });
      }
    },

    onError: error => {
      console.error("Failed to update page:", error);
    },
  });
};

// Delete page by slug
export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => pageApi.deletePage(slug),

    onSuccess: (_, deletedSlug) => {
      console.log("Page deleted successfully:", deletedSlug);

      // Remove the specific page from cache
      queryClient.removeQueries({ queryKey: PAGE_QUERY_KEY(deletedSlug) });

      // Invalidate and refetch pages list
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
    },

    onError: error => {
      console.error("Failed to delete page:", error);
    },
  });
};
