import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import {
  CreateNavbarRequest,
  UpdateNavbarRequest,
} from "@/types/owner-site/components/navbar";
import { toast } from "sonner";

const NAVBAR_QUERY_KEY = ["navbar"];

export const useNavbarQuery = () => {
  return useQuery({
    queryKey: NAVBAR_QUERY_KEY,
    queryFn: useNavbarApi.getNavbar,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNavbarRequest) => useNavbarApi.createNavbar(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create navbar");
    },
  });
};

export const useUpdateNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNavbarRequest) => useNavbarApi.updateNavbar(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update navbar");
    },
  });
};

export const useDeleteNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => useNavbarApi.deleteNavbar(id),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete navbar");
    },
  });
};
