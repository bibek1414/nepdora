import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi as useProductApi } from "@/services/api/owner-sites/product";
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

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => useProductApi.getProduct(slug),
    enabled: !!slug,
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
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdateProductRequest;
    }) => useProductApi.updateProduct(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate all product queries and specific product
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.slug] });
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
    mutationFn: (slug: string) => useProductApi.deleteProduct(slug),
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
