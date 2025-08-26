import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/services/api/orders";
import { CreateOrderRequest } from "@/types/owner-site/orders";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      orderApi.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
