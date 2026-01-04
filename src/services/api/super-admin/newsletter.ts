import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import { GetNepdoraNewslettersResponse } from "@/types/super-admin/newsletter";

export const superAdminNewsletterApi = {
  getAll: async (
    page = 1,
    pageSize = 10,
    search = ""
  ): Promise<GetNepdoraNewslettersResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) {
      params.append("search", search);
    }
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-newsletter/?${params}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },
};
