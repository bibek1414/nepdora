import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  Template,
  CreateTemplateRequest,
  CreateTemplateResponse,
  DeleteTemplateResponse,
  GetTemplatesResponse,
} from "@/types/super-admin/components/template";

export const useTemplateApi = {
  getTemplates: async (): Promise<Template[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/template-tenants/`, {
      method: "GET",
      headers: createHeaders(),
      cache: "no-store",
    });
    await handleApiError(response);
    const data: GetTemplatesResponse = await response.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  },

  createTemplate: async (
    payload: CreateTemplateRequest
  ): Promise<CreateTemplateResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/template-tenants/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(payload),
    });
    await handleApiError(response);
    const json = await response.json();
    if ((json as CreateTemplateResponse)?.data)
      return json as CreateTemplateResponse;
    return { data: json as Template };
  },

  // Updated to use owner_id instead of slug
  deleteTemplate: async (ownerId: number): Promise<DeleteTemplateResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/template-tenants/${ownerId}/`,
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
    return { success: true, message: "Template deleted successfully" };
  },
};
