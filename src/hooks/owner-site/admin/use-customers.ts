import { useQuery } from "@tanstack/react-query";
import { customerAPI } from "@/services/api/owner-sites/admin/customer";
import { CustomerFilters, PaginatedCustomers } from "@/types/owner-site/admin/customer";

export const useGetRegisteredCustomers = (filters: CustomerFilters = {}) => {
  return useQuery<PaginatedCustomers>({
    queryKey: ["registered-customers", filters],
    queryFn: () => customerAPI.getRegisteredCustomers(filters),
  });
};
