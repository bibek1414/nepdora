import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/services/api/owner-sites/admin/orders";
import {
  CreateOrderRequest,
  OrderPaginationParams,
  UpdateOrderStatusRequest,
} from "@/types/owner-site/admin/orders";
import { useAuth } from "@/hooks/use-auth";
import { useCallback } from "react";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      orderApi.createOrder(orderData, isAuthenticated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrders = (params: OrderPaginationParams = {}) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderApi.getOrders(params, isAuthenticated),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: previousData => previousData,
  });
};

export const useOrder = (id: number) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById(id, isAuthenticated),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: ({
      id,
      statusData,
    }: {
      id: number;
      statusData: UpdateOrderStatusRequest;
    }) => orderApi.updateOrderStatus(id, statusData, isAuthenticated),
    onSuccess: () => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: error => {
      console.error("Failed to update order status:", error);
    },
  });
};
