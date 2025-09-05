import { useQuery } from "@tanstack/react-query";
import { productApi as useProductApi } from "@/services/api/owner-sites/product";
import { PaginationParams } from "@/types/owner-site/product";

export const useSearchProducts = (
  searchQuery: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: ["products", "search", searchQuery],
    queryFn: () =>
      useProductApi.getProducts({
        search: searchQuery,
        limit: 10,
      } as PaginationParams),
    enabled: (options?.enabled ?? true) && searchQuery.length > 0,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSuggestedProducts = (options?: {
  enabled?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["products", "suggestions"],
    queryFn: () =>
      useProductApi.getProducts({
        limit: options?.limit ?? 10,
      } as PaginationParams),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};
