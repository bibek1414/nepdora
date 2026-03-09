import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import { UnreadCounts } from "@/types/owner-site/admin/stats";

export const statsApi = {
  getUnreadCounts: async (): Promise<UnreadCounts> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/stats/unread-counts/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },
};
