import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useThemeApi } from "@/services/api/owner-sites/components/theme";
import {
  CreateThemeRequest,
  UpdateThemeRequest,
} from "@/types/owner-site/components/theme";
import { toast } from "sonner";
import { useWebsiteSocketContext } from "@/providers/website-socket-provider";

const THEME_QUERY_KEY = ["themes"];

export const useThemeQuery = () => {
  return useQuery({
    queryKey: THEME_QUERY_KEY,
    queryFn: useThemeApi.getThemes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useThemeQueryPublished = () => {
  return useQuery({
    queryKey: THEME_QUERY_KEY,
    queryFn: useThemeApi.getThemesPublished,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateThemeMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: async (data: CreateThemeRequest) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("theme_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "update_theme",
          ...data,
        });
      });
    },
    onSuccess: data => {
      toast.success("Theme created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create theme");
    },
  });
};

export const useUpdateThemeMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: async (data: UpdateThemeRequest) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("theme_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "update_theme",
          ...data,
        });
      });
    },
    onSuccess: data => {
      toast.success("Theme updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update theme");
    },
  });
};
