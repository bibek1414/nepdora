import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
const API_BASE_URL = getApiBaseUrl();
export const ResetUi = async () => {
  const response = await apiFetch(`${API_BASE_URL}/api/reset-ui/`, {
    method: "POST",
    headers: createHeaders(),
  });
  const data = await response.json();
  return data;
};
