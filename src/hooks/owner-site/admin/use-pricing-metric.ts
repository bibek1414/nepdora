import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePricingMetricApi } from "@/services/api/owner-sites/admin/pricing-metric";
import { toast } from "sonner";
import {
  CreatePricingMetricRequest,
  UpdatePricingMetricRequest,
  PricingMetricQueryParams,
} from "@/types/owner-site/admin/pricing-metric";

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

export const usePricingMetrics = (params: PricingMetricQueryParams = {}) => {
  return useQuery({
    queryKey: ["pricing-metrics", params],
    queryFn: () => usePricingMetricApi.getPricingMetrics(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePricingMetric = (id: number | undefined) => {
  return useQuery({
    queryKey: ["pricing-metric", id],
    queryFn: () => {
      if (!id) {
        return Promise.resolve(null);
      }
      return usePricingMetricApi.getPricingMetric(id);
    },
    enabled: !!id,
  });
};

export const useCreatePricingMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePricingMetricRequest) =>
      usePricingMetricApi.createPricingMetric(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["pricing-metrics"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;

      if (apiError.status === 409) {
        toast.error(apiError.message || "This pricing metric already exists");
      } else if (apiError instanceof Error) {
        toast.error(apiError.message);
      } else {
        toast.error("Failed to create pricing metric");
      }
    },
  });
};

export const useUpdatePricingMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePricingMetricRequest }) =>
      usePricingMetricApi.updatePricingMetric(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pricing-metrics"] });
      queryClient.invalidateQueries({
        queryKey: ["pricing-metric", variables.id],
      });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;

      if (apiError.status === 409) {
        toast.error(apiError.message || "This pricing metric already exists");
      } else if (apiError instanceof Error) {
        toast.error(apiError.message);
      } else {
        toast.error("Failed to update pricing metric");
      }
    },
  });
};

export const useDeletePricingMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usePricingMetricApi.deletePricingMetric(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["pricing-metrics"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete pricing metric");
      }
    },
  });
};
