import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  Page,
  CreatePageRequest,
  UpdatePageRequest,
  CreatePageResponse,
  UpdatePageResponse,
  DeletePageResponse,
  GetPageResponse,
} from "@/types/owner-site/components/page";

export const pageApi = {
  // Get all pages
  getPages: async (): Promise<Page[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/pages/?status=preview`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Get single page by id
  getPage: async (id: number): Promise<GetPageResponse> => {
    // Changed from slug: string to id: number
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/pages/${id}/`, {
      // Use id in URL
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createPage: async (data: CreatePageRequest): Promise<CreatePageResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/pages/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  // Update page by id
  updatePage: async (
    id: number, // Changed from slug: string to id: number
    data: UpdatePageRequest
  ): Promise<UpdatePageResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/pages/${id}/`, {
      // Use id in URL
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  // Delete page by id
  deletePage: async (id: number): Promise<DeletePageResponse> => {
    // Changed from slug: string to id: number
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/pages/${id}/`, {
      // Use id in URL
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return { success: true, message: "Page deleted successfully" };
  },
};
