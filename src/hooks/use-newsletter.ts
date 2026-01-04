import { useMutation } from "@tanstack/react-query";
import { marketingNewsletterApi } from "@/services/api/marketing/newsletter";
import { toast } from "sonner";

export const useNewsletter = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: marketingNewsletterApi.subscribe,
    onSuccess: () => {
      toast.success("Subscribed successfully!");
    },
    onError: (error: any) => {
      // The error object is processed by handleApiError and has a specific structure
      // We prioritize showing the specific email error message user requested

      const fieldErrors =
        error.fieldErrors?.email ||
        error.data?.error?.params?.field_errors?.email;

      if (fieldErrors && Array.isArray(fieldErrors)) {
        fieldErrors.forEach((msg: string) => toast.error(msg));
        return;
      }

      // For other errors, show the message
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  return { mutate, isPending };
};
