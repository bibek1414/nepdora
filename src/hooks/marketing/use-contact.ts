import { useMutation } from "@tanstack/react-query";
import { marketingContactApi } from "@/services/api/marketing/contact";
import { ContactFormData } from "@/types/marketing/contact";

export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => marketingContactApi.submit(data),
  });
};
