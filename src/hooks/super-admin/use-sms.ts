import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTenantsSMSSettings,
  addSMSCredit,
} from "@/services/api/super-admin/sms";
import { AddSMSCreditPayload } from "@/types/super-admin/sms";
import { toast } from "sonner";

export const useTenantsSMSSettings = (page = 1, search = "") => {
  return useQuery({
    queryKey: ["superadmin", "sms-settings", page, search],
    queryFn: () => getTenantsSMSSettings(page, search),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddSMSCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddSMSCreditPayload) => addSMSCredit(payload),
    onSuccess: () => {
      toast.success("SMS credits added successfully");
      queryClient.invalidateQueries({
        queryKey: ["superadmin", "sms-settings"],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add SMS credits";
      toast.error(errorMessage);
    },
  });
};
