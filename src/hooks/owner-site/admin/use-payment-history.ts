import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentGatewayApi } from "@/services/api/owner-sites/admin/payment-gateway";

export const usePaymentHistory = (params: {
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["payment-history", params],
    queryFn: () => paymentGatewayApi.getPaymentHistory(params),
  });
};

export const useTenantCentralPayments = (params: {
  tenant: string;
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["tenant-central-payments", params],
    queryFn: () => paymentGatewayApi.getTenantCentralPayments(params),
    enabled: !!params.tenant,
  });
};

export const useTenantPaymentSummary = (tenant: string) => {
  return useQuery({
    queryKey: ["tenant-payment-summary", tenant],
    queryFn: () => paymentGatewayApi.getPaymentSummary(tenant),
    enabled: !!tenant,
  });
};

export const useUpdatePaymentHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_read }: { id: number; is_read: boolean }) =>
      paymentGatewayApi.updatePaymentHistory(id, { is_read }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
  });
};

export const useUpdateTenantCentralPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_read }: { id: number; is_read: boolean }) =>
      paymentGatewayApi.updateTenantCentralPayment(id, { is_read }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-central-payments"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
  });
};
