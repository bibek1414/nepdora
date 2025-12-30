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
} from "@/types/super-admin/components/template";

export const useTemplateApi = {
  getTemplates: async (
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    subcategory?: string,
    search?: string
  ): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Template[];
  }> => {
    const API_BASE_URL = getApiBaseUrl();

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (category) {
      params.append("category", category);
    }
    if (subcategory) {
      params.append("sub_category", subcategory);
    }
    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/template-tenants/?${params.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
        cache: "no-store",
      }
    );

    await handleApiError(response);
    const data = await response.json();

    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }

    if (data.results) {
      return data;
    }

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
    if (
      payload.template_category_id !== undefined &&
      payload.template_category_id !== null
    ) {
      formData.append(
        "template_category_id",
        payload.template_category_id.toString()
      );
    }
    if (
      payload.template_subcategory_id !== undefined &&
      payload.template_subcategory_id !== null
    ) {
      formData.append(
        "template_subcategory_id",
        payload.template_subcategory_id.toString()
      );
    }
    if (payload.preview_url !== undefined) {
      formData.append("preview_url", payload.preview_url || "");
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description || "");
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
