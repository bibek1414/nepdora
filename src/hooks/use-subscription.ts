import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "@/services/api/subscription";
import { toast } from "sonner";
import type {
  SubscriptionStatus,
  PlansResponse,
  UpgradeRequest,
} from "@/types/subscription";

export const useSubscriptionStatus = () => {
  return useQuery<SubscriptionStatus, Error>({
    queryKey: ["subscription", "status"],
    queryFn: subscriptionApi.getStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

export const usePricingPlans = () => {
  return useQuery<PlansResponse, Error>({
    queryKey: ["plans"],
    queryFn: subscriptionApi.getPlans,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpgradeRequest) => subscriptionApi.upgrade(data),
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message || "Subscription upgraded successfully!");
        queryClient.invalidateQueries({ queryKey: ["subscription", "status"] });

        // If there's a payment URL, redirect to it
        if (data.payment_url) {
          window.location.href = data.payment_url;
        }
      } else {
        toast.error(data.message || "Failed to upgrade subscription");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upgrade subscription");
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message || "Subscription cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ["subscription", "status"] });
      } else {
        toast.error(data.message || "Failed to cancel subscription");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
  });
};
