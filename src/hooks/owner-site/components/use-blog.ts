import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  blogComponentsApi,
  CreateBlogComponentRequest,
  UpdateBlogComponentRequest,
} from "@/services/api/owner-sites/components/blog";

// Hook to create blog component
export const useCreateBlogComponentMutation = (pageSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogComponentRequest) =>
      blogComponentsApi.createBlogComponent(pageSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      toast.success("Blog section added successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add blog section");
      }
    },
  });
};

// Hook to update blog component
export const useUpdateBlogComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      ...payload
    }: UpdateBlogComponentRequest & {
      componentId: string;
      pageSlug: string;
    }) => blogComponentsApi.updateBlogComponent(pageSlug, componentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Blog section updated successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update blog section");
      }
    },
  });
};

// Hook to delete blog component
export const useDeleteBlogComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      pageSlug,
    }: {
      componentId: string;
      pageSlug: string;
    }) => blogComponentsApi.deleteBlogComponent(componentId, pageSlug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Blog section removed successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove blog section");
      }
    },
  });
};
