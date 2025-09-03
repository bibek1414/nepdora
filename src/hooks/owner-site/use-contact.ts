import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "@/services/api/owner-sites/contact";
import {
  ContactFormData,
  PaginatedContacts,
  ContactFilters,
} from "@/types/owner-site/contact";

export const useGetContacts = (filters: ContactFilters = {}) => {
  return useQuery<PaginatedContacts>({
    queryKey: ["contacts", filters],
    queryFn: () => contactAPI.getContacts(filters),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormData) => contactAPI.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
