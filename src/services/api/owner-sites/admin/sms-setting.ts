import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  SMSSetting,
  UpdateSMSSettingRequest,
  UpdateSMSSettingResponse,
} from "@/types/owner-site/admin/sms-setting";

export const smsSettingApi = {
  // Get all sms settings
  getSMSSettings: async (): Promise<SMSSetting[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/settings/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Patch sms settings without ID (partial update on root)
  patchSMSSettings: async (
    data: UpdateSMSSettingRequest
  ): Promise<UpdateSMSSettingResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/settings/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },
};
