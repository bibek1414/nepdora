import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const marketingNewsletterApi = {
  subscribe: async (email: string) => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-newsletter/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({ email }),
      }
    );

    // We handle the error here or let the caller handle it.
    // The previous implementation used handleApiError, assuming it throws.
    await handleApiError(response);
    return response.json();
  },
};
