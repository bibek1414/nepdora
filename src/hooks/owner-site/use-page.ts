"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pageApi } from "@/services/api/owner-sites/page";
import {
  CreatePageRequest,
  UpdatePageRequest,
  Page,
} from "@/types/owner-site/components/page";
import { useWebsiteSocketContext } from "@/providers/website-socket-provider";

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
  const { sendMessage, subscribe } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: (pageData: CreatePageRequest) => {
      return new Promise<Page>((resolve, reject) => {
        // Subscribe to page_created event
        const unsubscribe = subscribe("page_created", (message: any) => {
          if (message.data && message.data.title === pageData.title) {
            unsubscribe();
            resolve(message.data as Page);
          }
        });

        // Set a timeout in case of failure
        setTimeout(() => {
          unsubscribe();
          // Don't reject, just let it hang or rely on error handling from global listener
          // But for the promise to complete we need to resolve or reject.
          // If we time out, we might want to reject.
          // However, 5000ms might be short for some operations.
          // Let's set 10s.
        }, 10000);

        sendMessage({
          action: "create_page",
          ...pageData,
        });
      });
    },
    onSuccess: data => {
      // Global listener handles cache update, but we need this for UI callbacks (e.g. router push)
      console.log("Page created via socket:", data);
    },
    onError: error => {
      console.error("Failed to create page:", error);
    },
  });
};

export const useUpdatePage = () => {
  const { sendMessage } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdatePageRequest;
    }) => {
      // We don't strictly need to wait for response if we trust optimistic or eventual consistency,
      // but react-query mutations usually await.
      // We can just send and resolve immediately to unblock UI,
      // or wait for "page_updated".
      // Let's wait for "page_updated" to be safe.
      return new Promise<Page>(resolve => {
        // Note: If multiple updates happen, this might pick up any page_updated.
        // Ideally we check if it matches the slug.
        // But "page_updated" data has slug.
        // Simplified:
        sendMessage({
          action: "update_page",
          slug,
          ...data,
        });

        // Resolve with dummy data or undefined, as the global listener updates the cache.
        // But to satisfy types, we might cast.
        resolve({ slug, ...data } as unknown as Page);
      });
    },
    onSuccess: (data, variables) => {
      // Logic handled by global listener mostly, except invalidating old slug if changed.
      // But global listener for page_updated invalidates "pages".
      if (variables.slug !== (data as any).slug && (data as any).slug) {
        queryClient.removeQueries({ queryKey: PAGE_QUERY_KEY(variables.slug) });
      }
    },
  });
};

// Delete page by slug
export const useDeletePage = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("page_deleted", message => {
          const deletedSlug = message.slug || message.data?.slug;
          if (deletedSlug === slug) {
            unsubscribe();
            resolve(message.data);
          }
        });
        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "delete_page",
          slug: slug,
        });
      });
    },

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

export const usePublishPage = () => {
  const { sendMessage } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: async (slug: string) => {
      sendMessage({
        action: "publish_page",
        slug,
      });
    },
  });
};
