import { apiFetch } from "@/lib/api-client";
import {
  Template,
  PaginatedTemplates,
  TemplateFilters,
  ImportTemplateRequest,
  ImportTemplateResponse,
} from "@/types/owner-site/admin/template";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const templateAPI = {
  getTemplates: async (
    filters: TemplateFilters = {}
  ): Promise<PaginatedTemplates> => {
    const BASE_API_URL = getApiBaseUrl();

    const { page = 1, page_size = 10, search } = filters;

    const url = new URL(`${BASE_API_URL}/api/template-tenants/`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("page_size", page_size.toString());

    if (search && search.trim()) {
      url.searchParams.append("search", search.trim());
    }

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  importTemplate: async (
    templateId: number
  ): Promise<ImportTemplateResponse> => {
    const BASE_API_URL = getApiBaseUrl();

    const response = await apiFetch(`${BASE_API_URL}/api/import-template/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        template_id: templateId,
      }),
    });

    await handleApiError(response);
    return await response.json();
  },

  getPreviewUrl: (schemaName: string): string => {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      return `http://${schemaName}.localhost:3000`;
    }

    return `https://${schemaName}.nepdora.com`;
  },
};
