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
export const usePages = () => {
  const socket = useContext(WebsiteSocketContext);

  return useQuery({
    queryKey: PAGES_QUERY_KEY("preview"),
    queryFn: () => {
      if (!socket || !socket.enabled) {
        return pageApi.getPages("preview");
      }
      return new Promise<Page[]>((resolve, reject) => {
        let isFinished = false;

        const cleanup = () => {
          isFinished = true;
          unsubscribeSuccess();
          unsubscribeError();
          clearTimeout(timeoutId);
        };

        const unsubscribeSuccess = socket.subscribe(
          "pages_list",
          (message: any) => {
            if (isFinished) return;
            cleanup();
            resolve(message.data as Page[]);
          }
        );

        const unsubscribeError = socket.subscribe(
          "socket_error",
          (message: any) => {
            if (isFinished) return;
            // For page list, if there's an error, we just resolve with empty list or reject fast
            cleanup();
            resolve([]);
          }
        );

        const timeoutId = setTimeout(() => {
          if (isFinished) return;
          cleanup();
          reject(new Error("Timeout waiting for pages list"));
        }, 10000);

        socket.sendMessage({
          action: "list_pages",
          status: "preview",
        });
      });
    },
    staleTime: 0,
  });
};

// Get single page by slug
export const usePage = (slug: string) => {
  const socket = useContext(WebsiteSocketContext);

  return useQuery({
    queryKey: PAGE_QUERY_KEY(slug),
    queryFn: () => {
      if (!socket || !socket.enabled) {
        return pageApi.getPage(slug);
      }
      return new Promise<Page>((resolve, reject) => {
        let isFinished = false;

        const cleanup = () => {
          isFinished = true;
          unsubscribeSuccess();
          unsubscribeError();
          clearTimeout(timeoutId);
        };

        const unsubscribeSuccess = socket.subscribe(
          "page_updated",
          (message: any) => {
            if (isFinished) return;
            if (message.slug === slug || message.data?.slug === slug) {
              cleanup();
              resolve(message.data as Page);
            }
          }
        );

        const unsubscribeError = socket.subscribe(
          "socket_error",
          (message: any) => {
            if (isFinished) return;
            // If we receive any socket error while waiting for a specific page,
            // we should probably stop waiting if it's a 404.
            if (message.error === "Page not found") {
              cleanup();
              reject(new Error("Page not found"));
            }
          }
        );

        const timeoutId = setTimeout(() => {
          if (isFinished) return;
          cleanup();
          reject(new Error("Timeout waiting for page details via WebSocket"));
        }, 10000);

        socket.sendMessage({
          action: "get_page",
          slug: slug,
        });
      });
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create new page
export const useCreatePage = () => {
  const socket = useContext(WebsiteSocketContext);

  return useMutation({
    mutationFn: (pageData: CreatePageRequest) => {
      if (!socket || !socket.enabled) {
        return pageApi.createPage(pageData);
      }
      return new Promise<Page>((resolve, reject) => {
        // Subscribe to page_created event
        const unsubscribe = socket.subscribe("page_created", (message: any) => {
          if (message.error) {
            unsubscribe();
            reject(message.error);
            return;
          }
          if (message.data && message.data.title === pageData.title) {
            unsubscribe();
            resolve(message.data as Page);
          }
        });

        // Also subscribe to generic socket_error in case action is missing on error
        const unsubscribeError = socket.subscribe(
          "socket_error",
          (message: any) => {
            // If we can correlate the error (e.g., it contains the title we tried to create)
            // Based on user log: {"error": {"non_field_errors": [...]}} - it might not have the title.
            // But if it's the only thing we're waiting for, we might have to assume it's this.
            // However, if the server sent an action in the error message, the first listener would catch it.
            unsubscribeError();
            unsubscribe();
            reject(message.error || message);
          }
        );

        // Set a timeout in case of failure
        const timeout = setTimeout(() => {
          unsubscribe();
          unsubscribeError();
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
      if (!socket || !socket.enabled) {
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
      if (!socket || !socket.enabled) {
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
      if (!socket || !socket.enabled) {
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
