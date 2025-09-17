import { DashboardStats } from "@/types/owner-site/admin/dashboard";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const API_BASE_URL = getApiBaseUrl();
  const response = await fetch(`${API_BASE_URL}/api/dashboard-stats/`, {
    method: "GET",
    headers: createHeaders(),
  });
  await handleApiError(response);
  return response.json();
};
