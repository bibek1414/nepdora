import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  Portfolio,
  PaginatedPortfolioResponse,
  CreatePortfolio,
  UpdatePortfolio,
  PortfolioTag,
  PortfolioCategory,
  PortfolioFilters,
} from "@/types/owner-site/admin/portfolio";

export interface CreatePortfolioTag {
  name: string;
}

export interface CreatePortfolioCategory {
  name: string;
}

const buildPortfolioFormData = (
  data: CreatePortfolio | UpdatePortfolio | Omit<UpdatePortfolio, "id">
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (key === "tags" && Array.isArray(value)) {
      value.forEach((id: number) => formData.append("tags", id.toString()));
    } else if (value instanceof File || value instanceof Blob) {
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

export const portfolioApi = {
  getPortfolios: async (
    filters?: PortfolioFilters
  ): Promise<PaginatedPortfolioResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.page_size)
        queryParams.append("page_size", filters.page_size.toString());
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.ordering) queryParams.append("ordering", filters.ordering);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => queryParams.append("tags", tag));
      }
    }

    const url = `${API_BASE_URL}/api/portfolio/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getPortfolioBySlug: async (slug: string): Promise<Portfolio> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${slug}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getTags: async (): Promise<PortfolioTag[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/portfolio-tags/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();
    return data.results || data;
  },

  getCategories: async (): Promise<PortfolioCategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/portfolio/category/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();
    return data.results || data;
  },

  createTag: async (tagData: CreatePortfolioTag): Promise<PortfolioTag> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/portfolio-tags/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(tagData),
    });

    await handleApiError(response);
    return response.json();
  },

  createCategory: async (
    categoryData: CreatePortfolioCategory
  ): Promise<PortfolioCategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/portfolio/category/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(categoryData),
    });

    await handleApiError(response);
    return response.json();
  },

  create: async (portfolioData: CreatePortfolio): Promise<Portfolio> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = buildPortfolioFormData(portfolioData);

    const response = await fetch(`${API_BASE_URL}/api/portfolio/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  update: async (
    slug: string,
    portfolioData: Omit<UpdatePortfolio, "id">
  ): Promise<Portfolio> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = buildPortfolioFormData(portfolioData);

    const response = await fetch(`${API_BASE_URL}/api/portfolio/${slug}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  delete: async (slug: string): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${slug}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    await handleApiError(response);
  },
};
