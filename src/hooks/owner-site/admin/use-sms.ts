import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smsApi } from "@/services/api/owner-sites/admin/sms";
import { CreateSMSPurchaseRequest, UpdateSMSPurchaseRequest } from "@/types/owner-site/admin/sms";
import { toast } from "sonner";

// Query Keys
export const smsKeys = {
  all: ["sms"] as const,
  balance: () => [...smsKeys.all, "balance"] as const,
  purchases: () => [...smsKeys.all, "purchases"] as const,
  purchase: (id: number | string) => [...smsKeys.purchases(), id] as const,
  history: () => [...smsKeys.all, "history"] as const,
};

// Hook to get SMS balance
export const useSMSBalance = () => {
  return useQuery({
    queryKey: smsKeys.balance(),
    queryFn: smsApi.getBalance,
    // Refetch on focus to keep balance updated
    refetchOnWindowFocus: true,
  });
};

// Hook to list SMS purchases
export const useSMSPurchases = () => {
  return useQuery({
    queryKey: smsKeys.purchases(),
    queryFn: smsApi.getPurchases,
  });
};

// Hook to get single purchase detail
export const useSMSPurchase = (id: number | string) => {
  return useQuery({
    queryKey: smsKeys.purchase(id),
    queryFn: () => smsApi.getPurchase(id),
    enabled: !!id,
  });
};

// Hook to create a purchase (usually called after payment verification)
export const useCreateSMSPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSMSPurchaseRequest) => smsApi.createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: smsKeys.balance() });
      queryClient.invalidateQueries({ queryKey: smsKeys.purchases() });
      toast.success("SMS credits added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add SMS credits");
    },
  });
};

// Hook to update a purchase
export const usePatchSMSPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateSMSPurchaseRequest }) =>
      smsApi.patchPurchase(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: smsKeys.purchases() });
      queryClient.invalidateQueries({ queryKey: smsKeys.purchase(data.id) });
    },
  });
};

// Hook to list SMS sending history
export const useSMSHistory = () => {
  return useQuery({
    queryKey: smsKeys.history(),
    queryFn: smsApi.getHistory,
  });
};
