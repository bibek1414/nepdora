import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  productComponentsApi,
  CreateProductsComponentRequest,
  UpdateProductsComponentRequest,
} from "@/services/api/owner-sites/components/product";

// Hook to create products component
export const useCreateProductsComponentMutation = (pageSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductsComponentRequest) =>
      productComponentsApi.createProductsComponent(pageSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      toast.success("Products section added successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add products section");
      }
    },
  });
};

// Hook to update products component
export const useUpdateProductsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      ...payload
    }: UpdateProductsComponentRequest & { componentId: string }) =>
      productComponentsApi.updateProductsComponent(componentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      toast.success("Products section updated successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update products section");
      }
    },
  });
};

// Hook to delete products component
export const useDeleteProductsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productComponentsApi.deleteProductsComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      toast.success("Products section removed successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove products section");
      }
    },
  });
};
