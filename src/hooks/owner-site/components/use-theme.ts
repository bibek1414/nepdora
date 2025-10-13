import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useThemeApi } from "@/services/api/owner-sites/components/theme";
import {
  CreateThemeRequest,
  UpdateThemeRequest,
} from "@/types/owner-site/components/theme";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateThemeRequest) => useThemeApi.createTheme(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create theme");
    },
  });
};

export const useUpdateThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateThemeRequest) => useThemeApi.updateTheme(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update theme");
    },
  });
};
