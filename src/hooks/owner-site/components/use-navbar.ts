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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
export const useNavbarQueryPublished = () => {
  return useQuery({
    queryKey: NAVBAR_QUERY_KEY,
    queryFn: useNavbarApi.getNavbarPublished,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateNavbarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      try {
        // Try to create the navbar
        return await useNavbarApi.createNavbar(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Check if navbar already exists - error.data.detail is the correct path
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
          // Get the existing navbar from cache or fetch it
          let existingNavbar = queryClient.getQueryData(
            NAVBAR_QUERY_KEY
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any;

          // If not in cache, fetch it
          if (!existingNavbar || !existingNavbar.data?.id) {
            try {
              existingNavbar = await useNavbarApi.getNavbar();
            } catch (fetchError) {
              throw new Error("Could not fetch existing navbar to replace it");
            }
          }

          // Extract the navbar ID - try multiple possible locations
          const navbarId =
            existingNavbar?.data?.id ||
            existingNavbar?.id ||
            existingNavbar?.data?.[0]?.id;

          if (navbarId) {
            try {
              // Delete the existing navbar
              await useNavbarApi.deleteNavbar(navbarId);

              // Wait a brief moment to ensure deletion is complete
              await new Promise(resolve => setTimeout(resolve, 300));

              // Create the new navbar
              const result = await useNavbarApi.createNavbar(data);

              // Show info toast about replacement
              toast.info("Previous navbar replaced with new design");

              return result;
            } catch (deleteError) {
              throw new Error("Failed to replace existing navbar");
            }
          } else {
            throw new Error("Could not find existing navbar ID");
          }
        }

        // Re-throw if it's a different error
        throw error;
      }
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
    mutationFn: (id: string) => useNavbarApi.deleteNavbar(id),
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
