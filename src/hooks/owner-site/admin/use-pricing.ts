import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePricingApi } from "@/services/api/owner-sites/admin/pricing";
import { toast } from "sonner";
import {
  CreatePricingRequest,
  UpdatePricingRequest,
  PricingQueryParams,
} from "@/types/owner-site/admin/pricing";

interface ApiError extends Error {
  status: number;
  data: {
    error?: {
      params?: {
        constraint_type?: string;
        constraint?: string;
      };
    };
    [key: string]: unknown;
  };
}

export const usePricings = (params: PricingQueryParams = {}) => {
  return useQuery({
    queryKey: ["pricings", params],
    queryFn: () => usePricingApi.getPricings(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePricing = (id: number | undefined) => {
  return useQuery({
    queryKey: ["pricing", id],
    queryFn: () => {
      if (!id) {
        return Promise.resolve(null);
      }
      return usePricingApi.getPricing(id);
    },
    enabled: !!id,
  });
};

export const useCreatePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePricingRequest) =>
      usePricingApi.createPricing(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["pricings"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;

      if (apiError.status === 409) {
        toast.error(apiError.message || "This pricing plan already exists");
      } else if (apiError instanceof Error) {
        toast.error(apiError.message);
      } else {
        toast.error("Failed to create pricing plan");
      }
    },
  });
};

export const useUpdatePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePricingRequest }) =>
      usePricingApi.updatePricing(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pricings"] });
      queryClient.invalidateQueries({
        queryKey: ["pricing", variables.id],
      });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;

      if (apiError.status === 409) {
        toast.error(apiError.message || "This pricing plan already exists");
      } else if (apiError instanceof Error) {
        toast.error(apiError.message);
      } else {
        toast.error("Failed to update pricing plan");
      }
    },
  });
};

export const useDeletePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usePricingApi.deletePricing(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["pricings"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete pricing plan");
      }
    },
  });
};
