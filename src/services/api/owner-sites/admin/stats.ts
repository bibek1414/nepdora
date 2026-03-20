import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import { AnalyticsStats, UnreadCounts } from "@/types/owner-site/admin/stats";

export const statsApi = {
  getUnreadCounts: async (): Promise<UnreadCounts> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/stats/unread-counts/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  getAnalyticsStats: async (params?: {
    start_date?: string;
    end_date?: string;
    month?: string;
    year?: string | number;
  }): Promise<AnalyticsStats> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.month) queryParams.append("month", params.month);
    if (params?.year) queryParams.append("year", params.year.toString());

    const response = await apiFetch(
      `${API_BASE_URL}/api/stats/stats/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },
};
