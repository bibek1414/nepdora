import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api/owner-sites/admin/product";
import type { ProductFilterParams } from "@/services/api/owner-sites/admin/product";

export const useSearchProducts = (
  searchQuery: string,
  options?: { enabled?: boolean; staleTime?: number }
) => {
  return useQuery({
    queryKey: ["products", "search", searchQuery],
    queryFn: () =>
      productApi.getProducts({
        search: searchQuery,
        page_size: 10,
      } satisfies ProductFilterParams),
    enabled: (options?.enabled ?? true) && searchQuery.length > 0,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSuggestedProducts = (options?: {
  enabled?: boolean;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: ["products", "suggestions"],
    queryFn: () =>
      productApi.getProducts({
        page_size: options?.page_size ?? 10,
      } satisfies ProductFilterParams),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
