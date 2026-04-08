import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { subscriptionApi } from "@/services/api/subscription";
import { getAuthToken } from "@/utils/auth";
import { toast } from "sonner";
import type {
  SubscriptionStatus,
  PlansResponse,
  UpgradeRequest,
  UserSubscriptionResponse,
} from "@/types/subscription";

const SUBSCRIPTION_STATUS_STORAGE_KEY = "nepdora-subscription-status";

function readPersistedSubscriptionStatus():
  | { data: SubscriptionStatus; updatedAt: number }
  | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const rawValue = window.localStorage.getItem(SUBSCRIPTION_STATUS_STORAGE_KEY);

  if (!rawValue) {
    return undefined;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as {
      data?: SubscriptionStatus;
      updatedAt?: number;
    };

    if (!parsedValue.data || typeof parsedValue.updatedAt !== "number") {
      return undefined;
    }

    return {
      data: parsedValue.data,
      updatedAt: parsedValue.updatedAt,
    };
  } catch {
    return undefined;
  }
}

function persistSubscriptionStatus(status: SubscriptionStatus) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SUBSCRIPTION_STATUS_STORAGE_KEY,
    JSON.stringify({
      data: status,
      updatedAt: Date.now(),
    })
  );
}

export const useSubscriptionStatus = () => {
  const pathname = usePathname();
  const token = getAuthToken();
  const persistedStatus = readPersistedSubscriptionStatus();

  // Only call the API if we have a token AND we are on allowed dashboard routes
  // The user specifically requested this to avoid calls on the main landing page
  const isAllowedPath =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/builder") ||
    pathname?.startsWith("/preview");

  return useQuery<SubscriptionStatus, Error>({
    queryKey: ["subscription", "status"],
    queryFn: async () => {
      const status = await subscriptionApi.getStatus();
      persistSubscriptionStatus(status);
      return status;
    },
    enabled: !!token && isAllowedPath,
    initialData: persistedStatus?.data,
    initialDataUpdatedAt: persistedStatus?.updatedAt,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

export const usePricingPlans = (
  options?: Omit<UseQueryOptions<PlansResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<PlansResponse, Error>({
    queryKey: ["plans"],
    queryFn: subscriptionApi.getPlans,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    ...options,
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

export const useUserSubscriptions = (page = 1) => {
  return useQuery<UserSubscriptionResponse, Error>({
    queryKey: ["subscriptions", "history", page],
    queryFn: () => subscriptionApi.getUserSubscriptions(page),
  });
};

export const useAllSubscriptions = (page = 1, search = "") => {
  return useQuery<UserSubscriptionResponse, Error>({
    queryKey: ["subscriptions", "all", page, search],
    queryFn: () => subscriptionApi.getAllSubscriptions(page, search),
  });
};
