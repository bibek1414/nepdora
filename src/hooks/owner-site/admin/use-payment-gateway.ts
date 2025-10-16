import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentGatewayApi } from "@/services/api/owner-sites/admin/payment-gateway";
import {
  PaymentGateway,
  CreatePaymentGatewayRequest,
  UpdatePaymentGatewayRequest,
} from "@/types/owner-site/admin/payment-gateway";

// Query Keys
export const paymentGatewayKeys = {
  all: ["payment-gateway"] as const,
  lists: () => [...paymentGatewayKeys.all, "list"] as const,
  list: (filters: string) =>
    [...paymentGatewayKeys.lists(), { filters }] as const,
  details: () => [...paymentGatewayKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentGatewayKeys.details(), id] as const,
};

export const usePaymentGateways = () => {
  return useQuery({
    queryKey: paymentGatewayKeys.lists(),
    queryFn: paymentGatewayApi.getPaymentGateways,
  });
};

// Get all payment gateway configs
export const usePaymentGatewaysKhalti = () => {
  return useQuery({
    queryKey: paymentGatewayKeys.lists(),
    queryFn: paymentGatewayApi.getPaymentGatewayKhalti,
  });
};
export const usePaymentGatewaysEsewa = () => {
  return useQuery({
    queryKey: paymentGatewayKeys.lists(),
    queryFn: paymentGatewayApi.getPaymentGatewayEsewa,
  });
};

// Get single payment gateway config
export const usePaymentGateway = (id: string) => {
  return useQuery({
    queryKey: paymentGatewayKeys.detail(id),
    queryFn: () => paymentGatewayApi.getPaymentGateway(id),
    enabled: !!id,
  });
};

// Create payment gateway config
export const useCreatePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentGatewayRequest) =>
      paymentGatewayApi.createPaymentGateway(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentGatewayKeys.lists() });
    },
  });
};

// Update payment gateway config
export const useUpdatePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePaymentGatewayRequest;
    }) => paymentGatewayApi.updatePaymentGateway(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentGatewayKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: paymentGatewayKeys.detail(variables.id),
      });
    },
  });
};

// Delete payment gateway config
export const useDeletePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentGatewayApi.deletePaymentGateway(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentGatewayKeys.lists() });
    },
  });
};
