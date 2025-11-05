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
} from "@/types/super-admin/page";
import { siteConfig } from "@/config/site";
const API_BASE_URL = siteConfig.apiBaseUrl;
export const pageApi = {
  // Get all pages
  getPages: async (): Promise<Page[]> => {
    const response = await fetch(`${API_BASE_URL}/api/template-pages/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getPage: async (slug: string): Promise<GetPageResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-pages/${slug}/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  createPage: async (data: CreatePageRequest): Promise<CreatePageResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/template-pages/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  updatePage: async (
    slug: string,
    data: UpdatePageRequest
  ): Promise<UpdatePageResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-pages/${slug}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  deletePage: async (slug: string): Promise<DeletePageResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-pages/${slug}/`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return { success: true, message: "Page deleted successfully" };
  },
};
