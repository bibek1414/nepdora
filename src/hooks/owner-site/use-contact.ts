import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "@/services/api/owner-sites/contact";
import {
  ContactFormData,
  PaginatedContacts,
  ContactFilters,
} from "@/types/owner-site/contact";
import { ContactFormSubmission } from "@/types/owner-site/components/contact";
import { toast } from "sonner";

export const useGetContacts = (filters: ContactFilters = {}) => {
  return useQuery<PaginatedContacts>({
    queryKey: ["contacts", filters],
    queryFn: () => contactAPI.getContacts(filters),
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
      toast.success(data.message);
      console.log("Contact form submitted successfully:", data);
    },
    onError: error => {
      toast.error("Failed to submit contact form");
      console.error("Failed to submit contact form:", error);
    },
  });
};
