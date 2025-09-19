import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  fetchOrderStatusCounts,
  fetchMyOrders,
} from "@/services/api/customer/my-orders";
import {
  OrderFilters,
  OrdersResponse,
  StatusCounts,
} from "@/types/customer/my-orders";
import { Order } from "@/types/owner-site/admin/orders";
import { useMemo } from "react";

// Query keys for my-orders
export const myOrderKeys = {
  all: ["my-orders"] as const,
  lists: () => [...myOrderKeys.all, "list"] as const,
  list: (filters: OrderFilters) => [...myOrderKeys.lists(), filters] as const,
  statusCounts: () => [...myOrderKeys.all, "status-counts"] as const,
};

// Hook to fetch my order status counts from API
export const useMyOrderStatusCounts = (
  options?: Omit<UseQueryOptions<StatusCounts, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: myOrderKeys.statusCounts(),
    queryFn: fetchOrderStatusCounts,
    staleTime: 2 * 60 * 1000, // 2 minutes - status counts change less frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options,
  });
};

// Get my orders hook
export const useMyOrders = (
  filters: OrderFilters = {},
  options?: Omit<UseQueryOptions<OrdersResponse, Error>, "queryKey" | "queryFn">
) => {
  // Provide default values for filters
  const defaultFilters: OrderFilters = {
    status: "all",
    search: "",
    page: 1,
    page_size: 5,
    ordering: "-created_at",
    ...filters,
  };

  return useQuery({
    queryKey: myOrderKeys.list(defaultFilters),
    queryFn: () => fetchMyOrders(defaultFilters),
    ...options,
  });
};

// Calculate status counts from orders data (fallback method)
export const useCalculatedMyOrderStatusCounts = (
  orders: Order[]
): StatusCounts => {
  return useMemo(() => {
    const counts: StatusCounts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      // Type-safe status counting
      switch (order.status) {
        case "pending":
          counts.pending++;
          break;
        case "processing":
          counts.processing++;
          break;
        case "shipped":
          counts.shipped++;
          break;
        case "delivered":
          counts.delivered++;
          break;
        case "cancelled":
          counts.cancelled++;
          break;
      }
    });

    return counts;
  }, [orders]);
};

// Prefetch my orders hook for better UX
export const usePrefetchMyOrders = () => {
  const queryClient = useQueryClient();

  return (filters: OrderFilters = {}) => {
    const defaultFilters: OrderFilters = {
      status: "all",
      search: "",
      page: 1,
      page_size: 5,
      ordering: "-created_at",
      ...filters,
    };

    queryClient.prefetchQuery({
      queryKey: myOrderKeys.list(defaultFilters),
      queryFn: () => fetchMyOrders(defaultFilters),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

// Prefetch my order status counts
export const usePrefetchMyOrderStatusCounts = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: myOrderKeys.statusCounts(),
      queryFn: fetchOrderStatusCounts,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };
};
