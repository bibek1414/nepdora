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
      pageSlug,
      componentId,
      ...payload
    }: UpdateProductsComponentRequest & {
      componentId: string;
      pageSlug: string;
    }) =>
      productComponentsApi.updateProductsComponent(
        pageSlug,
        componentId,
        payload
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
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
    mutationFn: ({
      componentId,
      pageSlug,
    }: {
      componentId: string;
      pageSlug: string;
    }) => productComponentsApi.deleteProductsComponent(componentId, pageSlug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
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
