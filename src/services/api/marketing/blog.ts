import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  BlogPost,
  PaginatedBlogResponse,
  BlogTag,
  BlogCategory,
  BlogFilters,
} from "@/types/super-admin/blog";

export const marketingBlogApi = {
  getBlogs: async (filters?: BlogFilters): Promise<PaginatedBlogResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.page_size)
        queryParams.append("page_size", filters.page_size.toString());
      if (filters.search) queryParams.append("search", filters.search);
      // is_published should probably be handled by the backend for public endpoint,
      // but we can pass it if explicit filtering is needed.
      // Usually public endpoints return only published.
      // queryParams.append("is_published", "true");
      if (filters.ordering) queryParams.append("ordering", filters.ordering);
      if (filters.author) queryParams.append("author", filters.author);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => queryParams.append("tags", tag));
      }
    }

    const url = `${API_BASE_URL}/api/nepdora-blogs/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(false), // No auth needed for public blogs
    });

    await handleApiError(response);
    return response.json();
  },

  getRecentBlogs: async (): Promise<BlogPost[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-recent-blogs/`, {
      method: "GET",
      headers: createHeaders(false),
    });

    await handleApiError(response);
    const data = await response.json();
    return data.results || data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-blogs/${slug}/`, {
      method: "GET",
      headers: createHeaders(false),
    });

    await handleApiError(response);
    return response.json();
  },

  getTags: async (): Promise<BlogTag[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-tags/`, {
      method: "GET",
      headers: createHeaders(false),
    });

    await handleApiError(response);
    const data = await response.json();

    return data.results || data;
  },

  getCategories: async (): Promise<BlogCategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/nepdora-blog-categories/`,
      {
        method: "GET",
        headers: createHeaders(false),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return data.results || data;
  },
};
