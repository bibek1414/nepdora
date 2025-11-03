import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFacebookApi } from "@/services/api/owner-sites/admin/facebook";
import {
  CreateFacebookIntegrationRequest,
  UpdateFacebookIntegrationRequest,
  FacebookIntegration,
} from "@/types/owner-site/admin/facebook";
import { toast } from "sonner";

const FACEBOOK_QUERY_KEY = "facebook-integrations";

export const useFacebookIntegrations = () => {
  return useQuery({
    queryKey: [FACEBOOK_QUERY_KEY],
    queryFn: useFacebookApi.getFacebookIntegrations,
  });
};

export const useFacebookIntegration = (id: number) => {
  return useQuery({
    queryKey: [FACEBOOK_QUERY_KEY, id],
    queryFn: () => useFacebookApi.getFacebookIntegration(id),
    enabled: !!id,
  });
};

export const useCreateFacebookIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFacebookIntegrationRequest) =>
      useFacebookApi.createFacebookIntegration(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: [FACEBOOK_QUERY_KEY] });
      toast.success(response.message);
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Facebook integration");
    },
  });
};

export const useUpdateFacebookIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateFacebookIntegrationRequest;
    }) => useFacebookApi.updateFacebookIntegration(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [FACEBOOK_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [FACEBOOK_QUERY_KEY, variables.id],
      });
      toast.success(response.message);
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Facebook integration");
    },
  });
};

export const useDeleteFacebookIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => useFacebookApi.deleteFacebookIntegration(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: [FACEBOOK_QUERY_KEY] });

      toast.success(response.message);
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete Facebook integration");
    },
  });
};

export const useToggleFacebookIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_enabled }: { id: number; is_enabled: boolean }) =>
      useFacebookApi.updateFacebookIntegration(id, { is_enabled }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [FACEBOOK_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [FACEBOOK_QUERY_KEY, variables.id],
      });
      toast.success(
        variables.is_enabled
          ? "Facebook page enabled successfully"
          : "Facebook page disabled successfully"
      );
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to toggle Facebook integration");
    },
  });
};
