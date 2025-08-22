import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFooterApi } from "@/services/api/owner-sites/components/footer";
import {
  CreateFooterRequest,
  UpdateFooterRequest,
} from "@/types/owner-site/components/footer";
import { toast } from "sonner";

const FOOTER_QUERY_KEY = ["footer"];

export const useFooterQuery = () => {
  return useQuery({
    queryKey: FOOTER_QUERY_KEY,
    queryFn: useFooterApi.getFooter,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFooterRequest) => useFooterApi.createFooter(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create footer");
    },
  });
};

export const useUpdateFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFooterRequest) => useFooterApi.updateFooter(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update footer");
    },
  });
};

export const useDeleteFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => useFooterApi.deleteFooter(),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete footer");
    },
  });
};
