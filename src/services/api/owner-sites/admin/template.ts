import {
  Template,
  PaginatedTemplates,
  TemplateFilters,
  ImportTemplateRequest,
  ImportTemplateResponse,
} from "@/types/owner-site/admin/template";
import { getApiBaseUrl, siteConfig } from "@/config/site";
import { getAuthToken } from "@/utils/auth";
const API_BASE_URL = siteConfig.apiBaseUrl;
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

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status}`);
    }

    return await response.json();
  },

  importTemplate: async (
    templateId: number
  ): Promise<ImportTemplateResponse> => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/templates/use/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        template_id: templateId,
        token: token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to use template: ${response.status}`
      );
    }

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
