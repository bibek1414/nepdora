"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pageApi } from "@/services/api/owner-sites/page";
import {
  CreatePageRequest,
  UpdatePageRequest,
  Page,
} from "@/types/owner-site/components/page";

export const PAGES_QUERY_KEY = ["pages"];
export const PAGE_QUERY_KEY = (id: number) => ["pages", id]; // Changed from slug to id

// Get all pages
export const usePages = () => {
  return useQuery({
    queryKey: PAGES_QUERY_KEY,
    queryFn: pageApi.getPages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single page by id
export const usePage = (id: number) => {
  // Changed from slug: string to id: number
  return useQuery({
    queryKey: PAGE_QUERY_KEY(id),
    queryFn: () => pageApi.getPage(id), // Changed from slug to id
    enabled: !!id,
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
      queryClient.setQueryData(PAGE_QUERY_KEY(data.id), data); // Changed from data.slug to data.id
    },
    onError: error => {
      console.error("Failed to create page:", error);
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdatePageRequest } // Changed from slug to id
    ) => pageApi.updatePage(id, data),
    onSuccess: (data: Page, variables) => {
      console.log("Page updated successfully:", data);
      // Update the specific page in cache
      queryClient.setQueryData(PAGE_QUERY_KEY(data.id), data); // Use data.id
      // Invalidate pages list to ensure consistency
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
      // If id changed (unlikely but possible), remove old cache entry
      if (data.id !== variables.id) {
        queryClient.removeQueries({ queryKey: PAGE_QUERY_KEY(variables.id) });
      }
    },
    onError: error => {
      console.error("Failed to update page:", error);
    },
  });
};

// Delete page by id
export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pageApi.deletePage(id), // Changed from slug: string to id: number
    onSuccess: (_, deletedId) => {
      // Changed from deletedSlug to deletedId
      console.log("Page deleted successfully:", deletedId);
      // Remove the specific page from cache
      queryClient.removeQueries({ queryKey: PAGE_QUERY_KEY(deletedId) });
      // Invalidate and refetch pages list
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
    },
    onError: error => {
      console.error("Failed to delete page:", error);
    },
  });
};
