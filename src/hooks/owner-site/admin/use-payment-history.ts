import { useQuery } from "@tanstack/react-query";
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
