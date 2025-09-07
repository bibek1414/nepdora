import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqApi } from "@/services/api/owner-sites/faq";
import { CreateFAQRequest, UpdateFAQRequest } from "@/types/owner-site/faq";
import { toast } from "sonner";

// Query Keys
export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  details: () => [...faqKeys.all, "detail"] as const,
  detail: (id: number) => [...faqKeys.details(), id] as const,
};

// Get all FAQs
export const useFAQs = () => {
  return useQuery({
    queryKey: faqKeys.lists(),
    queryFn: () => faqApi.getFAQs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single FAQ
export const useFAQ = (id: number) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => faqApi.getFAQ(id),
    enabled: !!id,
  });
};

// Create FAQ
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFAQRequest) => faqApi.createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      toast.success("FAQ created successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create FAQ");
    },
  });
};

// Update FAQ
export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFAQRequest }) =>
      faqApi.updateFAQ(id, data),
    onSuccess: updatedFAQ => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      queryClient.setQueryData(faqKeys.detail(updatedFAQ.id), updatedFAQ);
      toast.success("FAQ updated successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update FAQ");
    },
  });
};

// Delete FAQ
export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => faqApi.deleteFAQ(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      queryClient.removeQueries({ queryKey: faqKeys.detail(deletedId) });
      toast.success("FAQ deleted successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete FAQ");
    },
  });
};
