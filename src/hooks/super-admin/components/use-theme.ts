import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useThemeApi } from "@/services/api/super-admin/components/theme";
import {
  CreateThemeRequest,
  UpdateThemeRequest,
} from "@/types/super-admin/components/theme";
import { toast } from "sonner";

export const useThemeQuery = (templateSlug: string) => {
  return useQuery({
    queryKey: ["themes", templateSlug],
    queryFn: () => useThemeApi.getThemes(templateSlug),
    enabled: !!templateSlug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useThemeQueryPublished = (templateSlug: string) => {
  return useQuery({
    queryKey: ["themes", templateSlug],
    queryFn: () => useThemeApi.getThemesPublished(templateSlug),
    enabled: !!templateSlug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateThemeMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateThemeRequest) =>
      useThemeApi.createTheme(templateSlug, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["themes", templateSlug] });
      toast.success(data.message);
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create theme");
    },
  });
};

export const useUpdateThemeMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: UpdateThemeRequest;
    }) => useThemeApi.updateTheme(templateSlug, componentId, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["themes", templateSlug] });
      toast.success(data.message);
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update theme");
    },
  });
};
