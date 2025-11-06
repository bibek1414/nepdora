import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  faqCategoryApi,
  faqApi,
} from "@/services/api/super-admin/faq-category";
import {
  CreateFAQCategoryRequest,
  UpdateFAQCategoryRequest,
  GetFAQCategoryResponse,
  CreateFAQRequest,
  UpdateFAQRequest,
  GetFAQResponse,
  FAQCategory,
  FAQ,
} from "@/types/super-admin/faq-category";
import { toast } from "sonner";

// Query Keys
export const faqCategoryKeys = {
  all: ["faq-categories"] as const,
  lists: () => [...faqCategoryKeys.all, "list"] as const,
  details: () => [...faqCategoryKeys.all, "detail"] as const,
  detail: (id: number) => [...faqCategoryKeys.details(), id] as const,
};

export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  details: () => [...faqKeys.all, "detail"] as const,
  detail: (id: number) => [...faqKeys.details(), id] as const,
};

// FAQ Category Hooks
export const useFAQCategories = () => {
  return useQuery({
    queryKey: faqCategoryKeys.lists(),
    queryFn: () => faqCategoryApi.getFAQCategories(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFAQCategory = (id: number) => {
  return useQuery({
    queryKey: faqCategoryKeys.detail(id),
    queryFn: () => faqCategoryApi.getFAQCategory(id),
    enabled: !!id,
  });
};

export const useCreateFAQCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFAQCategoryRequest) =>
      faqCategoryApi.createFAQCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqCategoryKeys.lists() });
      toast.success("FAQ category created successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create FAQ category");
    },
  });
};

export const useUpdateFAQCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateFAQCategoryRequest;
    }) => faqCategoryApi.updateFAQCategory(id, data),
    onSuccess: updatedCategory => {
      queryClient.invalidateQueries({ queryKey: faqCategoryKeys.lists() });
      queryClient.setQueryData(
        faqCategoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      toast.success("FAQ category updated successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update FAQ category");
    },
  });
};

export const useDeleteFAQCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => faqCategoryApi.deleteFAQCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: faqCategoryKeys.lists() });
      queryClient.removeQueries({
        queryKey: faqCategoryKeys.detail(deletedId),
      });
      toast.success("FAQ category deleted successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete FAQ category");
    },
  });
};

// FAQ Hooks
export const useFAQs = () => {
  return useQuery({
    queryKey: faqKeys.lists(),
    queryFn: () => faqApi.getFAQs(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFAQ = (id: number) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => faqApi.getFAQ(id),
    enabled: !!id,
  });
};

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFAQRequest) => faqApi.createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      toast.success("FAQ created successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create FAQ");
    },
  });
};

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update FAQ");
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => faqApi.deleteFAQ(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      queryClient.removeQueries({ queryKey: faqKeys.detail(deletedId) });
      toast.success("FAQ deleted successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete FAQ");
    },
  });
};
