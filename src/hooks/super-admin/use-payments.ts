import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminPaymentApi } from "@/services/api/super-admin/payment";
import { CreateTransferRequest } from "@/types/super-admin/payment";
import { toast } from "sonner";

export const useSuperAdminPaymentSummary = (tenant?: string) => {
  return useQuery({
    queryKey: ["superadmin", "payment-summary", tenant],
    queryFn: () => superAdminPaymentApi.getPaymentSummary(tenant),
  });
};

export const useSuperAdminCentralPayments = (params?: {
  tenant?: string;
  search?: string;
  page?: number;
  page_size?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["superadmin", "central-payments", params],
    queryFn: () => superAdminPaymentApi.getCentralPayments(params),
    enabled: params?.enabled !== false,
  });
};

export const useSuperAdminTransferHistory = (params?: {
  tenant?: string;
  page?: number;
  page_size?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["superadmin", "transfer-history", params],
    queryFn: () => superAdminPaymentApi.getTransferHistory(params),
    enabled: params?.enabled !== false,
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransferRequest) => superAdminPaymentApi.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "transfer-history"] });
      queryClient.invalidateQueries({ queryKey: ["superadmin", "payment-summary"] });
      toast.success("Transfer recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record transfer");
    },
  });
};

export const useUpdateCentralPaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "pending" | "transferred" }) =>
      superAdminPaymentApi.updateCentralPaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "central-payments"] });
      queryClient.invalidateQueries({ queryKey: ["superadmin", "payment-summary"] });
      toast.success("Payment status updated");
    },
    onError: () => {
      toast.error("Failed to update payment status");
    },
  });
};
