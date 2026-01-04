import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateNewsletterRequest,
  CreateNewsletterResponse,
  GetNewslettersResponse,
} from "@/types/owner-site/admin/newsletter";

export const newsletterApi = {
  // Get all newsletter subscriptions with pagination
  getNewsletters: async (
    page = 1,
    pageSize = 10,
    search = ""
  ): Promise<GetNewslettersResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) {
      params.append("search", search);
    }
    const response = await fetch(`${API_BASE_URL}/api/newsletter/?${params}`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create newsletter subscription
  createNewsletter: async (
    data: CreateNewsletterRequest
  ): Promise<CreateNewsletterResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/newsletter/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },
};
