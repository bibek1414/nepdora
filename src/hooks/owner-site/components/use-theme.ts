import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useThemeApi } from "@/services/api/owner-sites/components/theme";
import {
  CreateThemeRequest,
  UpdateThemeRequest,
  GetThemeResponse,
} from "@/types/owner-site/components/theme";
import { toast } from "sonner";
import {
  WebsiteSocketContext,
  useWebsiteSocketContext,
} from "@/providers/website-socket-provider";
import { useContext } from "react";

import { usePathname } from "next/navigation";

const THEME_QUERY_KEY = ["themes"];

export const useThemeQuery = (
  enabled: boolean = true,
  status?: "preview" | "published"
) => {
  const socket = useContext(WebsiteSocketContext);
  const pathname = usePathname();

  const effectiveStatus =
    status ||
    (pathname?.startsWith("/preview") || pathname?.startsWith("/builder")
      ? "preview"
      : "published");

  return useQuery({
    queryKey: [...THEME_QUERY_KEY, effectiveStatus],
    queryFn: () => {
      // If we are in published mode, we should NOT use sockets or preview APIs
      if (effectiveStatus === "published") {
        return useThemeApi.getThemes("published");
      }

      if (!socket || !socket.enabled || !enabled) {
        return useThemeApi.getThemes(effectiveStatus);
      }
      return new Promise<GetThemeResponse>((resolve, reject) => {
        let isFinished = false;

        const cleanup = () => {
          isFinished = true;
          unsubscribeSuccess();
          unsubscribeError();
          clearTimeout(timeoutId);
        };

        const unsubscribeSuccess = socket.subscribe(
          "themes_list",
          (message: any) => {
            if (isFinished) return;
            cleanup();
            resolve({
              data: message.data || [],
              message: "Themes retrieved successfully",
            });
          }
        );

        const unsubscribeError = socket.subscribe(
          "socket_error",
          (message: any) => {
            if (isFinished) return;
            if (message.error === "Page not found") {
              cleanup();
              resolve({
                data: [],
                message: "Themes not found",
              });
            }
          }
        );

        const timeoutId = setTimeout(() => {
          if (isFinished) return;
          cleanup();
          reject(new Error("Timeout waiting for themes list"));
        }, 10000);

        socket.sendMessage({
          action: "list_themes",
          status: "preview",
        });
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (increased from 0 to reduce calls)
    retry: 2,
    enabled,
  });
};

export const useCreateThemeMutation = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateThemeRequest) => {
      if (!socket || !socket.enabled) {
        return useThemeApi.createTheme(data);
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe("theme_created", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for theme creation"));
        }, 10000);

        socket.sendMessage({
          action: "create_theme",
          ...data,
        });
      });
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: THEME_QUERY_KEY });
      const previousThemes = queryClient.getQueryData(THEME_QUERY_KEY);

      const optimisticTheme = {
        ...variables,
        id: `temp-${Date.now()}`,
        status: "draft",
        isOptimistic: true,
      };

      queryClient.setQueryData(THEME_QUERY_KEY, (old: any | undefined) => {
        if (!old) return { data: [optimisticTheme], message: "Optimistic" };
        return {
          ...old,
          data: [...(old.data || []), optimisticTheme],
        };
      });

      return { previousThemes };
    },
    onSuccess: data => {
      toast.success("Theme created successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousThemes) {
        queryClient.setQueryData(THEME_QUERY_KEY, context.previousThemes);
      }
      toast.error(error.message || "Failed to create theme");
    },
  });
};

export const useUpdateThemeMutation = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateThemeRequest) => {
      if (!socket || !socket.enabled) {
        return useThemeApi.updateTheme(data);
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe("theme_updated", message => {
          if (message.id === data.id || message.data?.id === data.id) {
            unsubscribe();
            resolve(message.data);
          }
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for theme update"));
        }, 10000);

        socket.sendMessage({
          action: "update_theme",
          ...data,
        });
      });
    },
    onMutate: async (data: UpdateThemeRequest) => {
      await queryClient.cancelQueries({ queryKey: THEME_QUERY_KEY });
      const previousThemes = queryClient.getQueryData(THEME_QUERY_KEY);

      queryClient.setQueryData(THEME_QUERY_KEY, (old: any | undefined) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((t: any) =>
            t.id === data.id ? { ...t, ...data } : t
          ),
        };
      });

      return { previousThemes };
    },
    onSuccess: data => {
      toast.success("Theme updated successfully");
      queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEY });
    },
    onError: (error: any, __, context) => {
      if (context?.previousThemes) {
        queryClient.setQueryData(THEME_QUERY_KEY, context.previousThemes);
      }
      toast.error(error.message || "Failed to update theme");
    },
  });
};

export const usePublishThemeMutation = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!socket || !socket.enabled) {
        throw new Error("WebSocket context required for theme publication");
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe("theme_published", message => {
          if (message.id === id || message.data?.id === id) {
            unsubscribe();
            resolve(message.data);
          }
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for theme publication"));
        }, 10000);

        socket.sendMessage({
          action: "publish_theme",
          id,
        });
      });
    },
    onSuccess: () => {
      toast.success("Theme published successfully");
      queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["themes", "published"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to publish theme");
    },
  });
};

export const useDeleteThemeMutation = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!socket || !socket.enabled) {
        throw new Error("WebSocket context required for theme deletion");
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe("theme_deleted", message => {
          if (message.id === id || message.data?.id === id) {
            unsubscribe();
            resolve(message.data);
          }
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for theme deletion"));
        }, 10000);

        socket.sendMessage({
          action: "delete_theme",
          id,
        });
      });
    },
    onSuccess: () => {
      toast.success("Theme deleted successfully");
      queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["themes", "published"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete theme");
    },
  });
};
