import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  ServicesPost,
  PaginatedServicesResponse,
  CreateServicesPost,
  UpdateServicesPost,
  ServicesFilters,
} from "@/types/owner-site/admin/services";

const buildServicesFormData = (
  data: CreateServicesPost | UpdateServicesPost | Omit<UpdateServicesPost, "id">
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null or undefined values
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const servicesApi = {
  getServices: async (
    filters?: ServicesFilters
  ): Promise<PaginatedServicesResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.page_size)
        queryParams.append("page_size", filters.page_size.toString());
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.ordering) queryParams.append("ordering", filters.ordering);
    }

    const url = `${API_BASE_URL}/api/service/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getServiceBySlug: async (slug: string): Promise<ServicesPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/service/${slug}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  create: async (serviceData: CreateServicesPost): Promise<ServicesPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = buildServicesFormData(serviceData);

    const response = await fetch(`${API_BASE_URL}/api/service/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // Don't set Content-Type header - let the browser set it with boundary
      },
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  update: async (
    slug: string,
    serviceData: Omit<UpdateServicesPost, "id">
  ): Promise<ServicesPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = buildServicesFormData(serviceData);

    const response = await fetch(`${API_BASE_URL}/api/service/${slug}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // Don't set Content-Type header - let the browser set it with boundary
      },
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  delete: async (slug: string): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/service/${slug}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    await handleApiError(response);
  },
};
