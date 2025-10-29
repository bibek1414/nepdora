import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePromoCodeApi } from "@/services/api/owner-sites/admin/promo-code";
import { toast } from "sonner";
import {
  CreatePromoCodeRequest,
  UpdatePromoCodeRequest,
  PaginationParams,
} from "@/types/owner-site/admin/promo-code";

export const usePromoCodes = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["promocodes", params],
    queryFn: () => usePromoCodeApi.getPromoCodes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePromoCode = (id: number) => {
  return useQuery({
    queryKey: ["promocode", id],
    queryFn: () => usePromoCodeApi.getPromoCode(id),
    enabled: !!id,
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromoCodeRequest) =>
      usePromoCodeApi.createPromoCode(data),
    onSuccess: response => {
      // Invalidate all promo code queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create promo code");
      }
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePromoCodeRequest }) =>
      usePromoCodeApi.updatePromoCode(id, data),
    onSuccess: (response, variables) => {
      // Invalidate all promo code queries and specific promo code
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      queryClient.invalidateQueries({ queryKey: ["promocode", variables.id] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update promo code");
      }
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usePromoCodeApi.deletePromoCode(id),
    onSuccess: response => {
      // Invalidate all promo code queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete promo code");
      }
    },
  });
};
