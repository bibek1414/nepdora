import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import {
  CreateNavbarRequest,
  UpdateNavbarRequest,
} from "@/types/owner-site/components/navbar";
import { toast } from "sonner";

const NAVBAR_QUERY_KEY = ["navbar"];

export const useNavbarQuery = () => {
  return useQuery({
    queryKey: NAVBAR_QUERY_KEY,
    queryFn: useNavbarApi.getNavbar,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useNavbarQueryPublished = () => {
  return useQuery({
    queryKey: NAVBAR_QUERY_KEY,
    queryFn: useNavbarApi.getNavbarPublished,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      // First, fetch existing navbar to get its ID
      let existingNavbar;
      try {
        existingNavbar = await useNavbarApi.getNavbar();
      } catch (error) {
        // No existing navbar, proceed with creation
        existingNavbar = null;
      }

      // If navbar exists, delete it first
      if (existingNavbar?.data?.id) {
        try {
          await useNavbarApi.deleteNavbar(existingNavbar.data.id);
          // Wait briefly to ensure deletion completes
          await new Promise(resolve => setTimeout(resolve, 300));
          toast.info("Previous navbar replaced with new design");
        } catch (deleteError) {
          console.error("Failed to delete existing navbar:", deleteError);
          throw new Error("Failed to replace existing navbar");
        }
      }

      // Now create the new navbar
      return await useNavbarApi.createNavbar(data);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      toast.success(data.message || "Navbar created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const useUpdateNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNavbarRequest) => useNavbarApi.updateNavbar(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      toast.success(data.message || "Navbar updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update navbar");
    },
  });
};

export const useDeleteNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return useNavbarApi.deleteNavbar(id);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      queryClient.setQueryData(NAVBAR_QUERY_KEY, null);
      toast.success(data.message || "Navbar deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete navbar");
    },
  });
};

export const useReplaceNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNavbarRequest) => useNavbarApi.replaceNavbar(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      toast.success(data.message || "Navbar replaced successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to replace navbar");
    },
  });
};
