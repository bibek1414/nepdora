import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerAPI } from "@/services/api/owner-sites/admin/customer";
import {
  CreateCustomerRequest,
  CustomerFilters,
  PaginatedCustomers,
} from "@/types/owner-site/admin/customer";
import { toast } from "sonner";

export const useGetRegisteredCustomers = (filters: CustomerFilters = {}) => {
  return useQuery<PaginatedCustomers>({
    queryKey: ["registered-customers", filters],
    queryFn: () => customerAPI.getRegisteredCustomers(filters),
    gcTime: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
  });
};

export const useRegisterCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) =>
      customerAPI.registerCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registered-customers"] });
      toast.success("Customer registered successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register customer");
    },
  });
};
