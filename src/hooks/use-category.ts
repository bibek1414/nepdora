import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCategoryApi } from "@/services/api/category";
import { toast } from "sonner";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PaginationParams,
} from "@/types/owner-site/product";

export const useCategories = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => useCategoryApi.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => useCategoryApi.getCategory(slug),
    enabled: !!slug,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      useCategoryApi.createCategory(data),
    onSuccess: response => {
      // Invalidate all category queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create category");
      }
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdateCategoryRequest;
    }) => useCategoryApi.updateCategory(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate all category queries and specific category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.slug] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update category");
      }
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => useCategoryApi.deleteCategory(slug),
    onSuccess: response => {
      // Invalidate all category queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete category");
      }
    },
  });
};
