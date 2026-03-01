"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pageApi } from "@/services/api/owner-sites/page";
import {
  CreatePageRequest,
  UpdatePageRequest,
  Page,
} from "@/types/owner-site/components/page";
import {
  WebsiteSocketContext,
  useWebsiteSocketContext,
} from "@/providers/website-socket-provider";
import { useContext } from "react";

export const PAGES_QUERY_KEY = (
  status: "preview" | "published" = "preview"
) => ["pages", status];

export const PAGE_QUERY_KEY = (slug: string) => ["pages", slug];

// Get all pages
export const usePages = (status: "preview" | "published" = "preview") => {
  const socket = useContext(WebsiteSocketContext);

  return useQuery({
    queryKey: PAGES_QUERY_KEY(status),
    queryFn: () => {
      if (!socket) {
        return pageApi.getPages();
      }
      return new Promise<Page[]>((resolve, reject) => {
        const unsubscribe = socket.subscribe("pages_list", (message: any) => {
          unsubscribe();
          resolve(message.data as Page[]);
        });

        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for pages list"));
        }, 10000);

        socket.sendMessage({
          action: "list_pages",
          status,
        });
      });
    },
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
  const socket = useContext(WebsiteSocketContext);

  return useMutation({
    mutationFn: (pageData: CreatePageRequest) => {
      if (!socket) {
        return pageApi.createPage(pageData);
      }
      return new Promise<Page>((resolve, reject) => {
        // Subscribe to page_created event
        const unsubscribe = socket.subscribe("page_created", (message: any) => {
          if (message.data && message.data.title === pageData.title) {
            unsubscribe();
            resolve(message.data as Page);
          }
        });

        // Set a timeout in case of failure
        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for page creation"));
        }, 10000);

        socket.sendMessage({
          action: "create_page",
          ...pageData,
        });
      });
    },
    onSuccess: data => {
      console.log("Page created successfully:", data);
    },
    onError: error => {
      console.error("Failed to create page:", error);
    },
  });
};

export const useUpdatePage = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdatePageRequest;
    }) => {
      if (!socket) {
        return pageApi.updatePage(slug, data);
      }
      return new Promise<Page>((resolve, reject) => {
        const unsubscribe = socket.subscribe("page_updated", (message: any) => {
          const updatedSlug = message.slug || message.data?.slug;
          if (updatedSlug === slug || message.data?.old_slug === slug) {
            unsubscribe();
            resolve(message.data as Page);
          }
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for page update"));
        }, 10000);

        socket.sendMessage({
          action: "update_page",
          slug,
          ...data,
        });
      });
    },
    onSuccess: (data, variables) => {
      if (variables.slug !== (data as any).slug && (data as any).slug) {
        queryClient.removeQueries({ queryKey: PAGE_QUERY_KEY(variables.slug) });
      }
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY() });
    },
  });
};

// Delete page by slug
export const useDeletePage = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => {
      if (!socket) {
        return pageApi.deletePage(slug);
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe("page_deleted", message => {
          const deletedSlug = message.slug || message.data?.slug;
          if (deletedSlug === slug) {
            unsubscribe();
            resolve(message.data);
          }
        });
        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for page deletion"));
        }, 10000);

        socket.sendMessage({
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
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY() });
    },

    onError: error => {
      console.error("Failed to delete page:", error);
    },
  });
};

export const usePublishPage = () => {
  const socket = useContext(WebsiteSocketContext);

  return useMutation({
    mutationFn: async (slug: string) => {
      if (!socket) {
        // Fallback for publish if exists, but most likely builder only
        throw new Error("WebSocket context required for page publication");
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe(
          "page_published",
          (message: any) => {
            if (message.slug === slug || message.data?.slug === slug) {
              unsubscribe();
              resolve(message.data);
            }
          }
        );

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for page publication"));
        }, 10000);

        socket.sendMessage({
          action: "publish_page",
          slug,
        });
      });
    },
  });
};
