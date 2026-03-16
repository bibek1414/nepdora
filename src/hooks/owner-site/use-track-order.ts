import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/services/api/owner-sites/admin/orders";

export const useTrackOrder = (orderNumber: string) => {
  return useQuery({
    queryKey: ["track-order", orderNumber],
    queryFn: () => orderApi.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
