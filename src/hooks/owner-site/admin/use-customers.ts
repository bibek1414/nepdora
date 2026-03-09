import { useQuery } from "@tanstack/react-query";
import { customerAPI } from "@/services/api/owner-sites/admin/customer";
import { Customer } from "@/types/owner-site/admin/customer";

export const useGetRegisteredCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ["registered-customers"],
    queryFn: () => customerAPI.getRegisteredCustomers(),
  });
};
