import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateTemplateResponse,
  UpdateTemplateResponse,
  DeleteTemplateResponse,
  GetTemplatesResponse,
} from "@/types/super-admin/components/template";

export const useTemplateApi = {
  getTemplates: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Template[];
  }> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/template-tenants/?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: createHeaders(),
        cache: "no-store",
      }
    );
    await handleApiError(response);
    const data = await response.json();

    // Handle both array response and paginated response
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }

    // Handle paginated response
    if (data.results) {
      return data;
    }

    // Handle the case where data is wrapped in a data property
    if (data.data && Array.isArray(data.data)) {
      return {
        count: data.data.length,
        next: null,
        previous: null,
        results: data.data,
      };
    }

    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
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
  updateTemplate: async (
    ownerId: number | string,
    payload: UpdateTemplateRequest
  ): Promise<UpdateTemplateResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const formData = new FormData();
    if (payload.template_image) {
      formData.append("template_image", payload.template_image);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/template-tenants/${ownerId}/`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      if ((json as UpdateTemplateResponse)?.data)
        return json as UpdateTemplateResponse;

      return { data: json as Template };
    }

    throw new Error("Unexpected response format from server");
  },

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
