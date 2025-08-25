import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubCategoryApi } from "@/services/api/sub-category";
import { toast } from "sonner";
import {
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  PaginationParams,
} from "@/types/owner-site/product";

export const useSubCategories = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["subcategories", params],
    queryFn: () => useSubCategoryApi.getSubCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubCategory = (slug: string) => {
  return useQuery({
    queryKey: ["subcategory", slug],
    queryFn: () => useSubCategoryApi.getSubCategory(slug),
    enabled: !!slug,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubCategoryRequest) =>
      useSubCategoryApi.createSubCategory(data),
    onSuccess: response => {
      // Invalidate all subcategory queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create subcategory");
      }
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdateSubCategoryRequest;
    }) => useSubCategoryApi.updateSubCategory(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate all subcategory queries and specific subcategory
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({
        queryKey: ["subcategory", variables.slug],
      });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update subcategory");
      }
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => useSubCategoryApi.deleteSubCategory(slug),
    onSuccess: response => {
      // Invalidate all subcategory queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete subcategory");
      }
    },
  });
};
