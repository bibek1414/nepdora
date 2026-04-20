import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { smsSettingApi } from "@/services/api/owner-sites/admin/sms-setting";
import { UpdateSMSSettingRequest } from "@/types/owner-site/admin/sms-setting";

// Query Keys
export const smsSettingKeys = {
  all: ["sms-settings"] as const,
  lists: () => [...smsSettingKeys.all, "list"] as const,
  details: () => [...smsSettingKeys.all, "detail"] as const,
  detail: (id: string | number) => [...smsSettingKeys.details(), id] as const,
};

// Get all SMS settings
export const useSMSSettings = () => {
  return useQuery({
    queryKey: smsSettingKeys.lists(),
    queryFn: smsSettingApi.getSMSSettings,
  });
};

// Patch SMS settings without ID
export const usePatchSMSSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSMSSettingRequest) =>
      smsSettingApi.patchSMSSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: smsSettingKeys.lists() });
    },
  });
};
