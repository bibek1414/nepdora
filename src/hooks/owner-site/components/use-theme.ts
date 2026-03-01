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

const THEME_QUERY_KEY = ["themes"];

export const useThemeQuery = (enabled: boolean = true) => {
  const socket = useContext(WebsiteSocketContext);

  return useQuery({
    queryKey: THEME_QUERY_KEY,
    queryFn: () => {
      if (!socket || !enabled) {
        return useThemeApi.getThemes();
      }
      return new Promise<GetThemeResponse>((resolve, reject) => {
        const unsubscribe = socket.subscribe("themes_list", (message: any) => {
          unsubscribe();
          resolve({
            data: message.data || [],
            message: "Themes retrieved successfully",
          });
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for themes list"));
        }, 10000);

        socket.sendMessage({
          action: "list_themes",
          status: "preview",
        });
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

export const useThemeQueryPublished = (enabled: boolean = true) => {
  const socket = useContext(WebsiteSocketContext);

  return useQuery({
    queryKey: ["themes", "published"],
    queryFn: () => {
      if (!socket || !enabled) {
        return useThemeApi.getThemesPublished();
      }
      return new Promise<GetThemeResponse>((resolve, reject) => {
        const unsubscribe = socket.subscribe("themes_list", (message: any) => {
          unsubscribe();
          resolve({
            data: message.data || [],
            message: "Themes retrieved successfully",
          });
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for published themes list"));
        }, 10000);

        socket.sendMessage({
          action: "list_themes",
          status: "published",
        });
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

export const useCreateThemeMutation = () => {
  const socket = useContext(WebsiteSocketContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateThemeRequest) => {
      if (!socket) {
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
      if (!socket) {
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
      if (!socket) {
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
      if (!socket) {
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
