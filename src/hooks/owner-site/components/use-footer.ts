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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFooterRequest) => {
      try {
        // Try to create the footer
        return await useFooterApi.createFooter(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Check if footer already exists - error.data.detail is the correct path
        const errorDetail =
          error?.data?.detail ||
          error?.detail ||
          error?.response?.data?.detail ||
          "";
        const errorMessage = error?.message || "";
        const errorString = typeof error === "string" ? error : "";

        const isFooterExists =
          errorDetail === "Footer already exists" ||
          errorMessage === "Footer already exists" ||
          errorString === "Footer already exists" ||
          errorDetail.includes("Footer already exists") ||
          errorMessage.includes("Footer already exists") ||
          (error?.status === 400 && errorDetail.includes("already exists"));

        if (isFooterExists) {
          // Get the existing footer from cache or fetch it
          let existingFooter = queryClient.getQueryData(
            FOOTER_QUERY_KEY
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any;

          // If not in cache, fetch it
          if (!existingFooter || !existingFooter.data?.id) {
            try {
              existingFooter = await useFooterApi.getFooter();
            } catch (fetchError) {
              throw new Error("Could not fetch existing footer to replace it");
            }
          }

          // Extract the footer ID - try multiple possible locations
          const footerId =
            existingFooter?.data?.id ||
            existingFooter?.id ||
            existingFooter?.data?.[0]?.id;

          if (footerId) {
            try {
              // Delete the existing footer
              await useFooterApi.deleteFooter();

              // Wait a brief moment to ensure deletion is complete
              await new Promise(resolve => setTimeout(resolve, 300));

              // Create the new footer
              const result = await useFooterApi.createFooter(data);

              // Show info toast about replacement
              toast.info("Previous footer replaced with new design");

              return result;
            } catch (deleteError) {
              throw new Error("Failed to replace existing footer");
            }
          } else {
            throw new Error("Could not find existing footer ID");
          }
        }

        // Re-throw if it's a different error
        throw error;
      }
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
    mutationFn: (data: UpdateFooterRequest) => useFooterApi.updateFooter(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      toast.success(data.message || "Footer updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update footer");
    },
  });
};

export const useDeleteFooterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => useFooterApi.deleteFooter(),
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
