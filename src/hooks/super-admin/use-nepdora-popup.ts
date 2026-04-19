import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminNepdoraPopupApi } from "@/services/api/super-admin/nepdora-popup";
import { NepdoraPopupFilters } from "@/types/marketing/nepdora-popup";

export const useNepdoraPopupSubmissions = (filters?: NepdoraPopupFilters) => {
  return useQuery({
    queryKey: ["superadmin", "popup-submissions", filters],
    queryFn: () => superAdminNepdoraPopupApi.getSubmissions(filters),
  });
};

export const useNepdoraPopupSubmission = (id: number) => {
  return useQuery({
    queryKey: ["superadmin", "popup-submission", id],
    queryFn: () => superAdminNepdoraPopupApi.getSubmission(id),
    enabled: !!id,
  });
};

export const useDeleteNepdoraPopupSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: superAdminNepdoraPopupApi.deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["superadmin", "popup-submissions"],
      });
    },
  });
};



