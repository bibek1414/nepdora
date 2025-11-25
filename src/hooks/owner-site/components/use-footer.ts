import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFooterApi } from "@/services/api/owner-sites/components/footer";
import {
  CreateFooterRequest,
  UpdateFooterRequest,
} from "@/types/owner-site/components/footer";
import { toast } from "sonner";

const FOOTER_QUERY_KEY = ["footer"];

export const useFooterQuery = () => {
  return useQuery({
    queryKey: FOOTER_QUERY_KEY,
    queryFn: useFooterApi.getFooter,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useFooterQueryPublished = () => {
  return useQuery({
    queryKey: FOOTER_QUERY_KEY,
    queryFn: useFooterApi.getFooterPublished,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFooterRequest) => {
      // First, fetch existing footer to get its ID
      let existingFooter;
      try {
        existingFooter = await useFooterApi.getFooter();
      } catch (error) {
        // No existing footer, proceed with creation
        existingFooter = null;
      }

      // If footer exists, delete it first
      if (existingFooter?.data?.id) {
        try {
          await useFooterApi.deleteFooter(existingFooter.data.id);
          // Wait briefly to ensure deletion completes
          await new Promise(resolve => setTimeout(resolve, 300));
          toast.info("Previous footer replaced with new design");
        } catch (deleteError) {
          console.error("Failed to delete existing footer:", deleteError);
          throw new Error("Failed to replace existing footer");
        }
      }

      // Now create the new footer
      return await useFooterApi.createFooter(data);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      toast.success(data.message || "Footer created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error?.data?.detail ||
        error?.detail ||
        error?.message ||
        error?.response?.data?.detail ||
        "Failed to create footer";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFooterRequest) => {
      console.log("🔧 UPDATE FOOTER MUTATION CALLED:", data);

      if (!data.id) {
        throw new Error("Footer ID is required for update");
      }

      const result = await useFooterApi.updateFooter(data);
      console.log("✅ UPDATE RESPONSE:", result);
      return result;
    },
    onSuccess: data => {
      console.log("🎉 UPDATE SUCCESS:", data);
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      toast.success(data.message || "Footer updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("❌ UPDATE ERROR:", error);
      toast.error(error.message || "Failed to update footer");
    },
  });
};

export const useDeleteFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get footer from API (not cache) to ensure we have the latest
      const existingFooter = await useFooterApi.getFooter();
      const footerId = existingFooter?.data?.id;

      if (!footerId) {
        throw new Error("No footer found to delete");
      }

      return useFooterApi.deleteFooter(footerId);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      queryClient.setQueryData(FOOTER_QUERY_KEY, null);
      toast.success(data.message || "Footer deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete footer");
    },
  });
};
