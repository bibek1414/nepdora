import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  TemplateCategory,
  TemplateSubcategory,
  CreateTemplateCategoryRequest,
  CreateTemplateSubcategoryRequest,
  TemplateCategoryResponse,
  TemplateSubcategoryResponse,
} from "@/types/super-admin/components/template-category";

export const useTemplateCategoryApi = {
  // Get all categories with optional search
  getCategories: async (search?: string): Promise<TemplateCategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = new URL(`${API_BASE_URL}/api/template-categories/`);
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
      cache: "no-store",
    });
    await handleApiError(response);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  },

  // Get single category by slug
  getCategory: async (slug: string): Promise<TemplateCategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/template-categories/${slug}/`,
      {
        method: "GET",
        headers: createHeaders(),
        cache: "no-store",
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Create category
  createCategory: async (
    payload: CreateTemplateCategoryRequest
  ): Promise<TemplateCategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/template-categories/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(payload),
    });
    await handleApiError(response);
    const json = await response.json();
    return (json as TemplateCategoryResponse)?.data || json;
  },

  // Get all subcategories with optional search
  getSubcategories: async (search?: string): Promise<TemplateSubcategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = new URL(`${API_BASE_URL}/api/template-subcategories/`);
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
      cache: "no-store",
    });
    await handleApiError(response);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  },

  // Get subcategories by category with optional search
  getSubcategoriesByCategory: async (
    categoryId: number,
    search?: string
  ): Promise<TemplateSubcategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = new URL(`${API_BASE_URL}/api/template-subcategories/`);
    url.searchParams.append("category", categoryId.toString());
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
      cache: "no-store",
    });
    await handleApiError(response);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  },

  // Get single subcategory by slug
  getSubcategory: async (slug: string): Promise<TemplateSubcategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/template-subcategories/${slug}/`,
      {
        method: "GET",
        headers: createHeaders(),
        cache: "no-store",
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Create subcategory
  createSubcategory: async (
    payload: CreateTemplateSubcategoryRequest
  ): Promise<TemplateSubcategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/template-subcategories/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      }
    );
    await handleApiError(response);
    const json = await response.json();
    return (json as TemplateSubcategoryResponse)?.data || json;
  },
};
