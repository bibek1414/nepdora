import { useQuery } from "@tanstack/react-query";
import { getDomains } from "@/services/api/super-admin/domain";

export const useTenants = (page = 1, pageSize = 100) => {
  return useQuery({
    queryKey: ["superadmin", "tenants", page, pageSize],
    queryFn: () => getDomains(page, pageSize),
    gcTime: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
  });
};
