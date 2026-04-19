import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  NepdoraPopupSubmission,
  NepdoraPopupListResponse,
  NepdoraPopupFilters,
} from "@/types/marketing/nepdora-popup";

export const superAdminNepdoraPopupApi = {
  getSubmissions: async (
    filters?: NepdoraPopupFilters
  ): Promise<NepdoraPopupListResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.page_size)
        queryParams.append("page_size", filters.page_size.toString());
    }

    const url = `${API_BASE_URL}/api/support/nepdora-popup-form/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiFetch(url, {
      method: "GET",
    });

    await handleApiError(response);
    return response.json();
  },

  getSubmission: async (id: number): Promise<NepdoraPopupSubmission> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/nepdora-popup-form/${id}/`,
      {
        method: "GET",
      }
    );

    await handleApiError(response);
    return response.json();
  },

  deleteSubmission: async (id: number): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/nepdora-popup-form/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    await handleApiError(response);
  },
};
