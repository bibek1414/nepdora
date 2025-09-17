import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  CreateFAQResponse,
  UpdateFAQResponse,
  DeleteFAQResponse,
  GetFAQResponse,
} from "@/types/owner-site/admin/faq";

export const faqApi = {
  // Get all FAQs
  getFAQs: async (): Promise<FAQ[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = `${API_BASE_URL}/api/faq/`;

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Get single FAQ by ID
  getFAQ: async (id: number): Promise<GetFAQResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/faq/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Create new FAQ
  createFAQ: async (data: CreateFAQRequest): Promise<CreateFAQResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/faq/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  // Update FAQ
  updateFAQ: async (
    id: number,
    data: UpdateFAQRequest
  ): Promise<UpdateFAQResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/faq/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  // Delete FAQ
  deleteFAQ: async (id: number): Promise<DeleteFAQResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/faq/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return { success: true, message: "FAQ deleted successfully" };
  },
};
