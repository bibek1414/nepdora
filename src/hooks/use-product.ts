import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProductApi } from "@/services/api/product";
import { toast } from "sonner";
import {
  CreateProductRequest,
  UpdateProductRequest,
  PaginationParams,
} from "@/types/owner-site/product";

export const useProducts = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => useProductApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => useProductApi.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      useProductApi.createProduct(data),
    onSuccess: response => {
      // Invalidate all product queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create product");
      }
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      useProductApi.updateProduct(id, data),
    onSuccess: (response, variables) => {
      // Invalidate all product queries and specific product
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update product");
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => useProductApi.deleteProduct(id),
    onSuccess: response => {
      // Invalidate all product queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete product");
      }
    },
  });
};
