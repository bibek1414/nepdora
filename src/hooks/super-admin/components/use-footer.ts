import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFooterApi } from "@/services/api/super-admin/components/footer";
import {
  CreateFooterRequest,
  UpdateFooterRequest,
} from "@/types/super-admin/components/footer";
import { toast } from "sonner";

export const useFooterQuery = (templateSlug: string) => {
  return useQuery({
    queryKey: ["footer", templateSlug],
    queryFn: () => useFooterApi.getFooter(templateSlug),
    enabled: !!templateSlug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useFooterQueryPublished = (templateSlug: string) => {
  return useQuery({
    queryKey: ["footer", templateSlug],
    queryFn: () => useFooterApi.getFooterPublished(templateSlug),
    enabled: !!templateSlug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateFooterMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFooterRequest) => {
      try {
        return await useFooterApi.createFooter(templateSlug, data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
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
          let existingFooter = queryClient.getQueryData([
            "footer",
            templateSlug,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
          ]) as any;

          if (!existingFooter || !existingFooter.data?.id) {
            try {
              existingFooter = await useFooterApi.getFooter(templateSlug);
            } catch (fetchError) {
              throw new Error("Could not fetch existing footer to replace it");
            }
          }

          const footerId =
            existingFooter?.data?.id ||
            existingFooter?.id ||
            existingFooter?.data?.[0]?.id;

          if (footerId) {
            try {
              await useFooterApi.deleteFooter(templateSlug, footerId);
              await new Promise(resolve => setTimeout(resolve, 300));
              const result = await useFooterApi.createFooter(
                templateSlug,
                data
              );
              toast.info("Previous footer replaced with new design");
              return result;
            } catch (deleteError) {
              throw new Error("Failed to replace existing footer");
            }
          } else {
            throw new Error("Could not find existing footer ID");
          }
        }
        throw error;
      }
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["footer", templateSlug] });
      toast.success(data.message || "Footer created successfully");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const useUpdateFooterMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: UpdateFooterRequest;
    }) => useFooterApi.updateFooter(templateSlug, componentId, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["footer", templateSlug] });
      toast.success(data.message || "Footer updated successfully");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update footer");
    },
  });
};

export const useDeleteFooterMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentId: string) =>
      useFooterApi.deleteFooter(templateSlug, componentId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["footer", templateSlug] });
      queryClient.setQueryData(["footer", templateSlug], null);
      toast.success(data.message || "Footer deleted successfully");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete footer");
    },
  });
};
