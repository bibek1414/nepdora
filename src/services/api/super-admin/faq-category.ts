import { siteConfig } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  FAQCategory,
  CreateFAQCategoryRequest,
  UpdateFAQCategoryRequest,
  CreateFAQCategoryResponse,
  UpdateFAQCategoryResponse,
  DeleteFAQCategoryResponse,
  GetFAQCategoryResponse,
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  CreateFAQResponse,
  UpdateFAQResponse,
  DeleteFAQResponse,
  GetFAQResponse,
} from "@/types/super-admin/faq-category";

export const faqCategoryApi = {
  // Get all FAQ categories
  getFAQCategories: async (): Promise<FAQCategory[]> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const url = `${API_BASE_URL}/api/support/faq-category/`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get single FAQ category by ID
  getFAQCategory: async (id: number): Promise<GetFAQCategoryResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(
      `${API_BASE_URL}/api/support/faq-category/${id}/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Create new FAQ category
  createFAQCategory: async (
    data: CreateFAQCategoryRequest
  ): Promise<CreateFAQCategoryResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(`${API_BASE_URL}/api/support/faq-category/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Update FAQ category
  updateFAQCategory: async (
    id: number,
    data: UpdateFAQCategoryRequest
  ): Promise<UpdateFAQCategoryResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(
      `${API_BASE_URL}/api/support/faq-category/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Delete FAQ category
  deleteFAQCategory: async (id: number): Promise<DeleteFAQCategoryResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(
      `${API_BASE_URL}/api/support/faq-category/${id}/`,
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
    return { success: true, message: "FAQ category deleted successfully" };
  },
};

export const faqApi = {
  // Get all FAQs
  getFAQs: async (): Promise<FAQ[]> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const url = `${API_BASE_URL}/api/support/faq/`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get single FAQ by ID
  getFAQ: async (id: number): Promise<GetFAQResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(`${API_BASE_URL}/api/support/faq/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create new FAQ
  createFAQ: async (data: CreateFAQRequest): Promise<CreateFAQResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(`${API_BASE_URL}/api/support/faq/`, {
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
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(`${API_BASE_URL}/api/support/faq/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete FAQ
  deleteFAQ: async (id: number): Promise<DeleteFAQResponse> => {
    const API_BASE_URL = siteConfig.apiBaseUrl;
    const response = await fetch(`${API_BASE_URL}/api/support/faq/${id}/`, {
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
