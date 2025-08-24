import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aboutApi } from "@/services/api/owner-sites/components/about";
import {
  CreateAboutUsRequest,
  UpdateAboutUsRequest,
  CreateAboutUsResponse,
  UpdateAboutUsResponse,
  DeleteAboutUsResponse,
} from "@/types/owner-site/components/about";
import { toast } from "sonner";

export const useCreateAboutUsMutation = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation<CreateAboutUsResponse, Error, CreateAboutUsRequest>({
    mutationFn: (data: CreateAboutUsRequest) =>
      aboutApi.createAboutUs(slug, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", slug] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create About Us component.");
    },
  });
};

export const useUpdateAboutUsMutation = (slug: string, componentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<UpdateAboutUsResponse, Error, UpdateAboutUsRequest>({
    mutationFn: (data: UpdateAboutUsRequest) =>
      aboutApi.updateAboutUs(slug, componentId, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", slug] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update About Us component.");
    },
  });
};

export const useDeleteAboutUsMutation = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation<DeleteAboutUsResponse, Error, string>({
    mutationFn: (componentId: string) =>
      aboutApi.deleteAboutUs(slug, componentId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", slug] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete About Us component.");
    },
  });
};
