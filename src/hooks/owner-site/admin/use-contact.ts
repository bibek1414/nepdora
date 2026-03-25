import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "@/services/api/owner-sites/admin/contact";
import {
  ContactFormData,
  PaginatedContacts,
  ContactFilters,
  Contact,
} from "@/types/owner-site/admin/contact";
import { ContactFormSubmission } from "@/types/owner-site/components/contact";
import { toast } from "sonner";

export const useGetContacts = (
  filters: ContactFilters = {},
  options: any = {}
) => {
  return useQuery<PaginatedContacts>({
    queryKey: ["contacts", filters],
    queryFn: () => contactAPI.getContacts(filters),
    ...options,
  });
};

export const useSubmitContactForm = (siteUser: string) => {
  return useMutation({
    mutationFn: (data: ContactFormSubmission) => {
      // Transform ContactFormSubmission to ContactFormData format
      const contactData: ContactFormData = {
        name: data.name,
        email: data.email || undefined,
        phone_number: data.phone_number || undefined,
        message: data.message,
      };

      return contactAPI.createContact(contactData);
    },
    onSuccess: data => {
      toast.success("Message sent successfully");
    },
    onError: error => {
      toast.error("Failed to send message");
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contact> }) =>
      contactAPI.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update contact:", error);
    },
  });
};
