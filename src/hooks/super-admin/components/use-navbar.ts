import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavbarApi } from "@/services/api/super-admin/components/navbar";
import {
  CreateNavbarRequest,
  UpdateNavbarRequest,
} from "@/types/super-admin/components/navbar";
import { toast } from "sonner";

export const useNavbarQuery = (templateSlug: string) => {
  return useQuery({
    queryKey: ["navbar", templateSlug],
    queryFn: () => useNavbarApi.getNavbar(templateSlug),
    enabled: !!templateSlug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useNavbarQueryPublished = (templateSlug: string) => {
  return useQuery({
    queryKey: ["navbar", templateSlug],
    queryFn: () => useNavbarApi.getNavbarPublished(templateSlug),
    enabled: !!templateSlug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateNavbarMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      try {
        return await useNavbarApi.createNavbar(templateSlug, data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorDetail =
          error?.data?.detail ||
          error?.detail ||
          error?.response?.data?.detail ||
          "";
        const errorMessage = error?.message || "";
        const errorString = typeof error === "string" ? error : "";

        const isNavbarExists =
          errorDetail === "Navbar already exists" ||
          errorMessage === "Navbar already exists" ||
          errorString === "Navbar already exists" ||
          errorDetail.includes("Navbar already exists") ||
          errorMessage.includes("Navbar already exists") ||
          (error?.status === 400 && errorDetail.includes("already exists"));

        if (isNavbarExists) {
          let existingNavbar = queryClient.getQueryData([
            "navbar",
            templateSlug,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
          ]) as any;

          if (!existingNavbar || !existingNavbar.data?.id) {
            try {
              existingNavbar = await useNavbarApi.getNavbar(templateSlug);
            } catch (fetchError) {
              throw new Error("Could not fetch existing navbar to replace it");
            }
          }

          const navbarId =
            existingNavbar?.data?.id ||
            existingNavbar?.id ||
            existingNavbar?.data?.[0]?.id;

          if (navbarId) {
            try {
              await useNavbarApi.deleteNavbar(templateSlug, navbarId);
              await new Promise(resolve => setTimeout(resolve, 300));
              const result = await useNavbarApi.createNavbar(
                templateSlug,
                data
              );
              toast.info("Previous navbar replaced with new design");
              return result;
            } catch (deleteError) {
              throw new Error("Failed to replace existing navbar");
            }
          } else {
            throw new Error("Could not find existing navbar ID");
          }
        }
        throw error;
      }
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["navbar", templateSlug] });
      toast.success(data.message || "Navbar created successfully");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error?.data?.detail ||
        error?.detail ||
        error?.message ||
        error?.response?.data?.detail ||
        "Failed to create navbar";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateNavbarMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: UpdateNavbarRequest;
    }) => useNavbarApi.updateNavbar(templateSlug, componentId, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["navbar", templateSlug] });
      toast.success(data.message || "Navbar updated successfully");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update navbar");
    },
  });
};

export const useDeleteNavbarMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentId: string) =>
      useNavbarApi.deleteNavbar(templateSlug, componentId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["navbar", templateSlug] });
      queryClient.setQueryData(["navbar", templateSlug], null);
      toast.success(data.message || "Navbar deleted successfully");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete navbar");
    },
  });
};
