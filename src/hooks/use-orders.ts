import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/services/api/orders";
import { CreateOrderRequest } from "@/types/owner-site/orders";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      orderApi.createOrder(orderData),
    onSuccess: () => {
      // Invalidate queries that might be affected, e.g., an orders list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes - orders don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for background updates
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes - individual orders are relatively stable
    gcTime: 15 * 60 * 1000, // 15 minutes - keep individual orders longer in cache
  });
};
